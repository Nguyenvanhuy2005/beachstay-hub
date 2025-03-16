
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

    // Booking successful, send email notification
    try {
      const emailResponse = await supabase.functions.invoke('send-booking-notification', {
        body: { 
          booking: bookingData,
          adminEmail: "nvh.adser@gmail.com" // Admin email
        }
      });
      
      if (emailResponse.error) {
        console.error('Email notification error:', emailResponse.error);
      } else {
        console.log('Email notification sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
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
      .select('*')
      .order('price', { ascending: false });

    if (error) {
      console.error('Error fetching room types:', error);
      return [];
    }

    console.log('Room types fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getRoomTypes:', error);
    return [];
  }
};

export const checkRoomAvailability = async (roomTypeId: string, checkIn: string, checkOut: string) => {
  try {
    console.log(`Checking availability for room type ${roomTypeId} from ${checkIn} to ${checkOut}`);
    
    // Gọi hàm RPC để kiểm tra tính khả dụng
    const { data, error } = await supabase
      .rpc('check_room_availability', {
        p_room_type_id: roomTypeId,
        p_check_in: checkIn,
        p_check_out: checkOut
      });

    if (error) {
      console.error('Error checking availability:', error);
      return { available: false, error };
    }

    console.log('Availability check result:', data);
    
    // Access the first element of the array returned by the RPC
    if (data && data.length > 0) {
      return { 
        available: data[0].available, 
        remainingRooms: data[0].remaining_rooms 
      };
    }

    return { available: false, error: 'No data returned from availability check' };
  } catch (error) {
    console.error('Unexpected error in checkRoomAvailability:', error);
    return { available: false, error };
  }
};

export const getBookingsByStatus = async (status?: string) => {
  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getBookingsByStatus:', error);
    return [];
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select();
    
    if (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error in updateBookingStatus:', error);
    return { success: false, error };
  }
};
