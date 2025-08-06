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

    // Return booking data - email will be sent from BookingForm
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
