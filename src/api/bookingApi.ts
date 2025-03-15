
import { supabase } from '@/integrations/supabase/client';
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
    // Gửi dữ liệu đặt phòng lên Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) {
      toast.error('Đã xảy ra lỗi khi đặt phòng! Vui lòng thử lại sau.');
      console.error('Booking error:', error);
      return { success: false, error };
    }

    // Đặt phòng thành công, gửi thông báo qua email
    try {
      const emailResponse = await supabase.functions.invoke('send-booking-notification', {
        body: { 
          booking: bookingData,
          adminEmail: "nvh.adser@gmail.com" // Email của admin
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

    // Đặt phòng thành công
    toast.success('Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    return { success: true, data };
  } catch (error) {
    toast.error('Đã xảy ra lỗi không mong muốn!');
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
};

export const getRoomTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .order('price', { ascending: false });

    if (error) {
      console.error('Error fetching room types:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

export const checkRoomAvailability = async (roomTypeId: string, checkIn: string, checkOut: string) => {
  try {
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

    return { available: data.available, remainingRooms: data.remaining_rooms };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { available: false, error };
  }
};
