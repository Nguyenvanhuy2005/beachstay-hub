
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use client from integrations to ensure consistency
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export imported client to maintain backward compatibility
export const supabase: SupabaseClient = supabaseClient;

// For admin checking (simplified to always return true to bypass authentication)
export const isAdmin = async () => {
  return true;
};

// Helper function for admin account creation (retained for future use)
export const createAdminAccount = async () => {
  // Keep the functionality for future use
  return true;
};

// Helper function to get public URL for a file in storage
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to call the check_room_availability RPC function
export const checkRoomAvailability = async (roomTypeId: string, checkIn: string, checkOut: string) => {
  try {
    console.log(`Checking availability for room type ${roomTypeId} from ${checkIn} to ${checkOut}`);
    
    const { data, error } = await supabase.rpc('check_room_availability', {
      p_room_type_id: roomTypeId,
      p_check_in: checkIn,
      p_check_out: checkOut
    });

    if (error) {
      console.error('Error in checkRoomAvailability:', error);
      return { available: false, error, remainingRooms: 0 };
    }

    console.log('Availability check result:', data);
    
    // Access the first element of the array returned by the RPC
    if (data && data.length > 0) {
      return { 
        available: data[0].available, 
        remainingRooms: data[0].remaining_rooms 
      };
    }

    return { available: false, error: 'No data returned', remainingRooms: 0 };
  } catch (error) {
    console.error('Unexpected error in checkRoomAvailability:', error);
    return { available: false, error, remainingRooms: 0 };
  }
};

// Helper function to get all booked dates for a room type
export const getBookedDatesForRoomType = async (roomTypeId: string) => {
  try {
    console.log('Fetching booked dates for room type:', roomTypeId);
    
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, check_out, status')
      .eq('room_type_id', roomTypeId)
      .neq('status', 'cancelled');

    if (error) {
      console.error('Error fetching booked dates:', error);
      return [];
    }

    console.log('Fetched booking data:', data?.length, 'bookings found');
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getBookedDatesForRoomType:', error);
    return [];
  }
};

// Helper function to get booked dates for all room types - useful for admin view
export const getAllBookedDates = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, check_out, room_type_id, status')
      .neq('status', 'cancelled');
      
    if (error) {
      console.error('Error fetching all booked dates:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getAllBookedDates:', error);
    return [];
  }
};
