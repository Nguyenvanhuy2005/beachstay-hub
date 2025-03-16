
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
    // Make sure to use PUBLIC schema to bypass RLS
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

// Helper function to get bookings with room information included
export const getBookingsWithRoomInfo = async (statusFilter?: string) => {
  try {
    console.log('Fetching bookings with room info. Status filter:', statusFilter || 'all');
    
    // Build the query to join bookings with room_types
    let query = supabase
      .from('bookings')
      .select(`
        *,
        room_types:room_type_id (
          id,
          name,
          name_en
        )
      `)
      .order('created_at', { ascending: false });
    
    // Apply status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings with room info:', error);
      return [];
    }
    
    console.log('Fetched bookings with room info:', data?.length, 'bookings found');
    
    // Transform the data to make it easier to work with
    const enhancedBookings = data?.map(booking => ({
      ...booking,
      room_name: booking.room_types?.name || 'Unknown Room',
      room_name_en: booking.room_types?.name_en || 'Unknown Room'
    })) || [];
    
    return enhancedBookings;
  } catch (error) {
    console.error('Unexpected error in getBookingsWithRoomInfo:', error);
    return [];
  }
};

// Get room price for a specific date
export const getRoomPriceForDate = async (roomTypeId: string, date: string) => {
  try {
    // First check if there's a custom price for this date
    const { data: customPrice, error: customPriceError } = await supabase
      .from('room_date_prices')
      .select('price')
      .eq('room_type_id', roomTypeId)
      .eq('date', date)
      .maybeSingle();
      
    if (customPriceError) {
      console.error('Error fetching custom price:', customPriceError);
    }
    
    if (customPrice) {
      return customPrice.price;
    }
    
    // If no custom price, get the regular/weekend price from room_types
    const { data: room, error: roomError } = await supabase
      .from('room_types')
      .select('price, weekend_price')
      .eq('id', roomTypeId)
      .single();
      
    if (roomError) {
      console.error('Error fetching room details:', roomError);
      return null;
    }
    
    // Check if the date is a Saturday (day 6)
    const dateObj = new Date(date);
    const isSaturday = dateObj.getDay() === 6;
    
    return isSaturday && room.weekend_price ? room.weekend_price : room.price;
  } catch (error) {
    console.error('Unexpected error in getRoomPriceForDate:', error);
    return null;
  }
};

// Get custom prices for a room type within a date range
export const getCustomPricesForRoom = async (roomTypeId: string, startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('room_date_prices')
      .select('date, price')
      .eq('room_type_id', roomTypeId)
      .gte('date', startDate)
      .lte('date', endDate);
      
    if (error) {
      console.error('Error fetching custom prices:', error);
      return {};
    }
    
    // Convert array to map for easier access
    const pricesMap: Record<string, number> = {};
    data?.forEach(item => {
      pricesMap[item.date] = item.price;
    });
    
    return pricesMap;
  } catch (error) {
    console.error('Unexpected error in getCustomPricesForRoom:', error);
    return {};
  }
};

// Helper to synchronize gallery images with Supabase
export const syncGalleryImages = async (images: any[]) => {
  try {
    console.log('Starting gallery images synchronization...');
    
    // Clear existing gallery images first
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
    if (deleteError) {
      console.error('Error clearing gallery images:', deleteError);
      return { success: false, error: deleteError };
    }
    
    // Insert new images
    const { data, error: insertError } = await supabase
      .from('gallery_images')
      .insert(images)
      .select();
      
    if (insertError) {
      console.error('Error inserting gallery images:', insertError);
      return { success: false, error: insertError };
    }
    
    console.log('Gallery images synchronized successfully:', data?.length);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error in syncGalleryImages:', error);
    return { success: false, error };
  }
};

// Helper function to import/export database content for backup
export const exportDatabaseContent = async (table: string) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');
      
    if (error) {
      console.error(`Error exporting ${table}:`, error);
      return { success: false, error };
    }
    
    console.log(`Exported ${data?.length} records from ${table}`);
    
    // Create a download link for the JSON data
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create and click a download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${table}_export_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    return { success: true, data };
  } catch (error) {
    console.error(`Unexpected error exporting ${table}:`, error);
    return { success: false, error };
  }
};
