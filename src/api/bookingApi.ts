import { supabase, checkRoomAvailability } from '@/lib/supabase';
import { toast } from 'sonner';

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  adults: number;
  children: number;
  specialRequests?: string;
}

export const createBooking = async (bookingData: BookingFormData) => {
  try {
    console.log('Creating booking with data:', bookingData);
    
    // Double-check availability before proceeding with booking creation
    const availabilityCheck = await checkRoomAvailability(
      bookingData.roomType,
      bookingData.checkIn,
      bookingData.checkOut
    );
    
    if (!availabilityCheck.available) {
      console.error('Room is not available for the selected dates');
      toast.error('Phòng đã hết chỗ cho ngày bạn chọn! Vui lòng chọn ngày khác hoặc loại phòng khác.');
      return { success: false, error: 'Room not available', remainingRooms: availabilityCheck.remainingRooms || 0 };
    }
    
    // Transform the booking data to match Supabase schema
    const supabaseBookingData = {
      full_name: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      room_type_id: bookingData.roomType,
      adults: bookingData.adults,
      children: bookingData.children,
      special_requests: bookingData.specialRequests,
      status: 'pending' // Default status is 'pending'
    };

    console.log('Transformed data for Supabase:', supabaseBookingData);

    // Send booking data to Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert(supabaseBookingData)
      .select();

    if (error) {
      console.error('Booking error:', error);
      toast.error('Đã xảy ra lỗi khi đặt phòng! Vui lòng thử lại sau.');
      return { success: false, error };
    }

    console.log('Booking created successfully:', data);

    // Booking successful, send email notification with enhanced logging
    try {
      console.log('Preparing to send email notification for booking...');
      
      // Get the admin email from admin_access table instead of hardcoding
      const { data: adminData, error: adminError } = await supabase
        .from('admin_access')
        .select('email')
        .eq('is_active', true)
        .limit(1)
        .single();
      
      if (adminError) {
        console.error('Error fetching admin email:', adminError);
        toast.error('Đặt phòng thành công nhưng không thể gửi email xác nhận. Chúng tôi sẽ liên hệ với bạn sớm.');
        return { success: true, data, bookingId: data[0]?.id };
      }
      
      const adminEmail = adminData?.email || "nvh.adser@gmail.com"; // Fallback to default if not found
      console.log('Admin email for notification:', adminEmail);
      
      const requestBody = { 
        booking: bookingData,
        adminEmail: adminEmail
      };
      
      console.log('Sending notification request to edge function:', JSON.stringify(requestBody));
      
      const emailResponse = await supabase.functions.invoke('send-booking-notification', {
        body: requestBody
      });
      
      console.log('Email notification response received:', emailResponse);
      
      if (emailResponse.error) {
        console.error('Email notification error:', emailResponse.error);
        console.error('Email error details:', JSON.stringify(emailResponse));
        
        // Check for domain verification error in the response
        const responseData = emailResponse.data as any;
        if (responseData?.message?.includes('domain is not verified')) {
          console.error('Domain verification error:', responseData.message);
          toast.error('Đặt phòng thành công! Tuy nhiên, hệ thống email đang gặp vấn đề về xác thực tên miền. Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        } else {
          toast.error('Đặt phòng thành công nhưng không thể gửi email xác nhận. Chúng tôi sẽ liên hệ với bạn sớm.');
        }
      } else {
        console.log('Email notification response data:', emailResponse.data);
        console.log('Email notification sent successfully');
        toast.success('Đặt phòng thành công! Email xác nhận đã được gửi.');
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      console.error('Email error stack:', emailError instanceof Error ? emailError.stack : 'No stack trace');
      toast.error('Đặt phòng thành công nhưng không thể gửi email xác nhận. Chúng tôi sẽ liên hệ với bạn sớm.');
    }

    // Booking successful
    toast.success('Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    return { success: true, data, bookingId: data[0]?.id };
  } catch (error) {
    console.error('Unexpected error:', error);
    toast.error('Đã xảy ra lỗi không mong muốn!');
    return { success: false, error };
  }
};

export const getRoomTypes = async () => {
  try {
    console.log('Fetching room types from Supabase...');
    const { data, error } = await supabase
      .from('room_types')
      .select('*');

    if (error) {
      console.error('Error fetching room types:', error);
      return [];
    }

    console.log('Room types fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getRoomTypes:', error);
    return [];
  }
};

export const getBookingsByStatus = async (status?: string) => {
  try {
    console.log('Fetching bookings with status filter:', status || 'all');
    
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return { success: false, error, data: [] };
    }
    
    console.log('Bookings fetched:', data?.length || 0);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error in getBookingsByStatus:', error);
    return { success: false, error, data: [] };
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    console.log(`Updating booking ${bookingId} status to ${status}`);
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error };
    }
    
    console.log('Booking status updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error in updateBookingStatus:', error);
    return { success: false, error };
  }
};
