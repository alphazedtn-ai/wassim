import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { IPTVOffer, AdminData, AndroidBox, SatelliteReceiver, Accessory } from '../types';

// Check if Supabase is properly configured
const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using fallback behavior.');
    return false;
  }
  return true;
};

// Enhanced error logging function
const logError = (operation: string, error: any, context?: any) => {
  console.error(`Database Error [${operation}]:`, {
    error,
    context,
    timestamp: new Date().toISOString()
  });
};

// Helper function to ensure authenticated requests
const getAuthenticatedSupabase = () => {
  // For admin operations, we need to ensure we're using the authenticated client
  return supabase;
};

// IPTV Offers Functions
export const getOffers = async (): Promise<IPTVOffer[]> => {
  try {
    if (!checkSupabaseConfig()) {
      return [];
    }

    console.log('Fetching IPTV offers...');
    
    const { data, error } = await getAuthenticatedSupabase()
      .from('iptv_offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logError('getOffers', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} IPTV offers`);
    return data || [];
  } catch (error) {
    logError('getOffers', error);
    return [];
  }
};

export const saveOffer = async (offer: Omit<IPTVOffer, 'id' | 'created_at' | 'updated_at'>): Promise<IPTVOffer | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot save offer: Supabase not configured');
      return null;
    }

    // Enhanced validation
    if (!offer.name?.trim()) {
      console.error('Validation failed: App name is required');
      return null;
    }
    
    if (!offer.download_url?.trim()) {
      console.error('Validation failed: Download URL is required');
      return null;
    }
    
    if (!offer.app_name?.trim()) {
      console.error('Validation failed: App category is required');
      return null;
    }

    const offerData = {
      name: offer.name.trim(),
      price: offer.price?.trim() || '',
      description: offer.description?.trim() || '',
      image_url: offer.image_url?.trim() || 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400',
      download_url: offer.download_url.trim(),
      app_name: offer.app_name.trim()
    };

    console.log('Saving new IPTV offer:', offerData);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'authenticated' : 'not authenticated');

    const { data, error } = await getAuthenticatedSupabase()
      .from('iptv_offers')
      .insert(offerData)
      .select()
      .single();

    if (error) {
      logError('saveOffer', error, offerData);
      
      // If it's an RLS error, provide more specific guidance
      if (error.code === '42501') {
        console.error('RLS Policy Error: Make sure you are authenticated and have proper permissions');
        console.error('Current session status:', session ? 'authenticated' : 'not authenticated');
      }
      
      return null;
    }

    console.log('IPTV offer saved successfully:', data);
    return data;
  } catch (error) {
    logError('saveOffer', error, offer);
    return null;
  }
};

export const updateOffer = async (id: string, offer: Partial<IPTVOffer>): Promise<IPTVOffer | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot update offer: Supabase not configured');
      return null;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for update');
      return null;
    }

    console.log(`Starting update for IPTV offer ID: ${id}`);
    console.log('Update data:', offer);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session for update:', session ? 'authenticated' : 'not authenticated');

    // First, check if the record exists
    const { data: existingOffer, error: checkError } = await getAuthenticatedSupabase()
      .from('iptv_offers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('updateOffer - existence check', checkError, { id });
      return null;
    }

    if (!existingOffer) {
      console.error(`No IPTV offer found with ID: ${id}`);
      return null;
    }

    console.log('Found existing offer:', existingOffer);

    // Build update data with enhanced validation
    const updateData: any = {};
    
    if (offer.name !== undefined) {
      if (!offer.name.trim()) {
        console.error('Validation failed: Name cannot be empty');
        return null;
      }
      updateData.name = offer.name.trim();
    }
    
    if (offer.price !== undefined) {
      updateData.price = offer.price?.trim() || '';
    }
    
    if (offer.description !== undefined) {
      updateData.description = offer.description?.trim() || '';
    }
    
    if (offer.image_url !== undefined) {
      updateData.image_url = offer.image_url?.trim() || 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    
    if (offer.download_url !== undefined) {
      if (!offer.download_url.trim()) {
        console.error('Validation failed: Download URL cannot be empty');
        return null;
      }
      updateData.download_url = offer.download_url.trim();
    }
    
    if (offer.app_name !== undefined) {
      if (!offer.app_name.trim()) {
        console.error('Validation failed: App category cannot be empty');
        return null;
      }
      updateData.app_name = offer.app_name.trim();
    }

    // Only proceed if we have data to update
    if (Object.keys(updateData).length === 0) {
      console.log('No changes detected, returning existing offer');
      return existingOffer;
    }

    console.log('Performing update with data:', updateData);

    // Perform the update - using array response to avoid PGRST116
    const { data: updatedData, error: updateError } = await getAuthenticatedSupabase()
      .from('iptv_offers')
      .update(updateData)
      .eq('id', id)
      .select('*');

    if (updateError) {
      logError('updateOffer - update operation', updateError, { id, updateData });
      
      if (updateError.code === '42501') {
        console.error('RLS Policy Error during update: Make sure you are authenticated and have proper permissions');
      }
      
      return null;
    }

    // Check if any rows were affected
    if (!updatedData || updatedData.length === 0) {
      console.log('Update operation completed but no rows were affected - data may be identical, returning existing offer');
      return existingOffer;
    }

    const updatedOffer = updatedData[0];
    console.log('IPTV offer updated successfully:', updatedOffer);
    return updatedOffer;
  } catch (error) {
    logError('updateOffer', error, { id, offer });
    return null;
  }
};

export const deleteOffer = async (id: string): Promise<boolean> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot delete offer: Supabase not configured');
      return false;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for delete');
      return false;
    }

    console.log(`Attempting to delete IPTV offer with ID: ${id}`);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session for delete:', session ? 'authenticated' : 'not authenticated');

    // First check if the record exists
    const { data: existingOffer, error: checkError } = await getAuthenticatedSupabase()
      .from('iptv_offers')
      .select('id, name')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('deleteOffer - existence check', checkError, { id });
      return false;
    }

    if (!existingOffer) {
      console.error(`IPTV offer not found with ID: ${id}`);
      return false;
    }

    console.log(`Deleting offer: ${existingOffer.name}`);

    // Perform the delete
    const { error: deleteError } = await getAuthenticatedSupabase()
      .from('iptv_offers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logError('deleteOffer - delete operation', deleteError, { id });
      
      if (deleteError.code === '42501') {
        console.error('RLS Policy Error during delete: Make sure you are authenticated and have proper permissions');
      }
      
      return false;
    }

    console.log('IPTV offer deleted successfully');
    return true;
  } catch (error) {
    logError('deleteOffer', error, { id });
    return false;
  }
};

// Android Boxes Functions
export const getAndroidBoxes = async (): Promise<AndroidBox[]> => {
  try {
    if (!checkSupabaseConfig()) {
      return [];
    }

    console.log('Fetching Android boxes...');
    
    const { data, error } = await getAuthenticatedSupabase()
      .from('android_boxes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logError('getAndroidBoxes', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} Android boxes`);
    return data || [];
  } catch (error) {
    logError('getAndroidBoxes', error);
    return [];
  }
};

export const saveAndroidBox = async (box: Omit<AndroidBox, 'id' | 'created_at' | 'updated_at'>): Promise<AndroidBox | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot save Android box: Supabase not configured');
      return null;
    }

    // Enhanced validation
    if (!box.name?.trim()) {
      console.error('Validation failed: Box name is required');
      return null;
    }
    
    if (!box.price?.trim()) {
      console.error('Validation failed: Price is required');
      return null;
    }
    
    if (!box.purchase_url?.trim()) {
      console.error('Validation failed: Purchase URL is required');
      return null;
    }

    const boxData = {
      name: box.name.trim(),
      price: box.price.trim(),
      description: box.description?.trim() || '',
      image_url: box.image_url?.trim() || 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      purchase_url: box.purchase_url.trim(),
      specifications: box.specifications?.trim() || '',
      is_available: box.is_available ?? true
    };

    console.log('Saving new Android box:', boxData);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session for Android box save:', session ? 'authenticated' : 'not authenticated');

    const { data, error } = await getAuthenticatedSupabase()
      .from('android_boxes')
      .insert(boxData)
      .select()
      .single();

    if (error) {
      logError('saveAndroidBox', error, boxData);
      
      if (error.code === '42501') {
        console.error('RLS Policy Error: Make sure you are authenticated and have proper permissions');
      }
      
      return null;
    }

    console.log('Android box saved successfully:', data);
    return data;
  } catch (error) {
    logError('saveAndroidBox', error, box);
    return null;
  }
};

export const updateAndroidBox = async (id: string, box: Partial<AndroidBox>): Promise<AndroidBox | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot update Android box: Supabase not configured');
      return null;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for update');
      return null;
    }

    console.log(`Starting update for Android box ID: ${id}`);
    console.log('Update data:', box);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session for Android box update:', session ? 'authenticated' : 'not authenticated');

    // First, check if the record exists
    const { data: existingBox, error: checkError } = await getAuthenticatedSupabase()
      .from('android_boxes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('updateAndroidBox - existence check', checkError, { id });
      return null;
    }

    if (!existingBox) {
      console.error(`No Android box found with ID: ${id}`);
      return null;
    }

    console.log('Found existing box:', existingBox);

    // Build update data with enhanced validation
    const updateData: any = {};
    
    if (box.name !== undefined) {
      if (!box.name.trim()) {
        console.error('Validation failed: Name cannot be empty');
        return null;
      }
      updateData.name = box.name.trim();
    }
    
    if (box.price !== undefined) {
      if (!box.price.trim()) {
        console.error('Validation failed: Price cannot be empty');
        return null;
      }
      updateData.price = box.price.trim();
    }
    
    if (box.description !== undefined) {
      updateData.description = box.description?.trim() || '';
    }
    
    if (box.image_url !== undefined) {
      updateData.image_url = box.image_url?.trim() || 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    
    if (box.purchase_url !== undefined) {
      if (!box.purchase_url.trim()) {
        console.error('Validation failed: Purchase URL cannot be empty');
        return null;
      }
      updateData.purchase_url = box.purchase_url.trim();
    }
    
    if (box.specifications !== undefined) {
      updateData.specifications = box.specifications?.trim() || '';
    }
    
    if (box.is_available !== undefined) {
      updateData.is_available = box.is_available;
    }

    // Only proceed if we have data to update
    if (Object.keys(updateData).length === 0) {
      console.log('No changes detected, returning existing box');
      return existingBox;
    }

    console.log('Performing update with data:', updateData);

    // Perform the update - using array response to avoid PGRST116
    const { data: updatedData, error: updateError } = await getAuthenticatedSupabase()
      .from('android_boxes')
      .update(updateData)
      .eq('id', id)
      .select('*');

    if (updateError) {
      logError('updateAndroidBox - update operation', updateError, { id, updateData });
      
      if (updateError.code === '42501') {
        console.error('RLS Policy Error during Android box update: Make sure you are authenticated and have proper permissions');
      }
      
      return null;
    }

    // Check if any rows were affected
    if (!updatedData || updatedData.length === 0) {
      console.log('Update operation completed but no rows were affected - data may be identical, returning existing box');
      return existingBox;
    }

    const updatedBox = updatedData[0];
    console.log('Android box updated successfully:', updatedBox);
    return updatedBox;
  } catch (error) {
    logError('updateAndroidBox', error, { id, box });
    return null;
  }
};

export const deleteAndroidBox = async (id: string): Promise<boolean> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot delete Android box: Supabase not configured');
      return false;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for delete');
      return false;
    }

    console.log(`Attempting to delete Android box with ID: ${id}`);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session for Android box delete:', session ? 'authenticated' : 'not authenticated');

    // First check if the record exists
    const { data: existingBox, error: checkError } = await getAuthenticatedSupabase()
      .from('android_boxes')
      .select('id, name')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('deleteAndroidBox - existence check', checkError, { id });
      return false;
    }

    if (!existingBox) {
      console.error(`Android box not found with ID: ${id}`);
      return false;
    }

    console.log(`Deleting box: ${existingBox.name}`);

    // Perform the delete
    const { error: deleteError } = await getAuthenticatedSupabase()
      .from('android_boxes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logError('deleteAndroidBox - delete operation', deleteError, { id });
      
      if (deleteError.code === '42501') {
        console.error('RLS Policy Error during Android box delete: Make sure you are authenticated and have proper permissions');
      }
      
      return false;
    }

    console.log('Android box deleted successfully');
    return true;
  } catch (error) {
    logError('deleteAndroidBox', error, { id });
    return false;
  }
};

// Satellite Receivers Functions
export const getSatelliteReceivers = async (): Promise<SatelliteReceiver[]> => {
  try {
    if (!checkSupabaseConfig()) {
      return [];
    }

    console.log('Fetching satellite receivers...');
    
    const { data, error } = await getAuthenticatedSupabase()
      .from('satellite_receivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logError('getSatelliteReceivers', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} satellite receivers`);
    return data || [];
  } catch (error) {
    logError('getSatelliteReceivers', error);
    return [];
  }
};

export const saveSatelliteReceiver = async (receiver: Omit<SatelliteReceiver, 'id' | 'created_at' | 'updated_at'>): Promise<SatelliteReceiver | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot save satellite receiver: Supabase not configured');
      return null;
    }

    if (!receiver.name?.trim() || !receiver.price?.trim() || !receiver.purchase_url?.trim()) {
      console.error('Validation failed: Required fields missing');
      return null;
    }

    const receiverData = {
      name: receiver.name.trim(),
      price: receiver.price.trim(),
      description: receiver.description?.trim() || '',
      image_url: receiver.image_url?.trim() || 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
      purchase_url: receiver.purchase_url.trim(),
      specifications: receiver.specifications?.trim() || '',
      is_available: receiver.is_available ?? true
    };

    console.log('Saving new satellite receiver:', receiverData);

    const { data, error } = await getAuthenticatedSupabase()
      .from('satellite_receivers')
      .insert(receiverData)
      .select()
      .single();

    if (error) {
      logError('saveSatelliteReceiver', error, receiverData);
      return null;
    }

    console.log('Satellite receiver saved successfully:', data);
    return data;
  } catch (error) {
    logError('saveSatelliteReceiver', error, receiver);
    return null;
  }
};

export const updateSatelliteReceiver = async (id: string, receiver: Partial<SatelliteReceiver>): Promise<SatelliteReceiver | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot update satellite receiver: Supabase not configured');
      return null;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for update');
      return null;
    }

    console.log(`Starting update for satellite receiver ID: ${id}`);

    const { data: existingReceiver, error: checkError } = await getAuthenticatedSupabase()
      .from('satellite_receivers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('updateSatelliteReceiver - existence check', checkError, { id });
      return null;
    }

    if (!existingReceiver) {
      console.error(`No satellite receiver found with ID: ${id}`);
      return null;
    }

    const updateData: any = {};
    
    if (receiver.name !== undefined) {
      if (!receiver.name.trim()) {
        console.error('Validation failed: Name cannot be empty');
        return null;
      }
      updateData.name = receiver.name.trim();
    }
    
    if (receiver.price !== undefined) {
      if (!receiver.price.trim()) {
        console.error('Validation failed: Price cannot be empty');
        return null;
      }
      updateData.price = receiver.price.trim();
    }
    
    if (receiver.description !== undefined) {
      updateData.description = receiver.description?.trim() || '';
    }
    
    if (receiver.image_url !== undefined) {
      updateData.image_url = receiver.image_url?.trim() || 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    
    if (receiver.purchase_url !== undefined) {
      if (!receiver.purchase_url.trim()) {
        console.error('Validation failed: Purchase URL cannot be empty');
        return null;
      }
      updateData.purchase_url = receiver.purchase_url.trim();
    }
    
    if (receiver.specifications !== undefined) {
      updateData.specifications = receiver.specifications?.trim() || '';
    }
    
    if (receiver.is_available !== undefined) {
      updateData.is_available = receiver.is_available;
    }

    if (Object.keys(updateData).length === 0) {
      console.log('No changes detected, returning existing receiver');
      return existingReceiver;
    }

    const { data: updatedData, error: updateError } = await getAuthenticatedSupabase()
      .from('satellite_receivers')
      .update(updateData)
      .eq('id', id)
      .select('*');

    if (updateError) {
      logError('updateSatelliteReceiver - update operation', updateError, { id, updateData });
      return null;
    }

    if (!updatedData || updatedData.length === 0) {
      console.log('Update operation completed but no rows were affected');
      return existingReceiver;
    }

    const updatedReceiver = updatedData[0];
    console.log('Satellite receiver updated successfully:', updatedReceiver);
    return updatedReceiver;
  } catch (error) {
    logError('updateSatelliteReceiver', error, { id, receiver });
    return null;
  }
};

export const deleteSatelliteReceiver = async (id: string): Promise<boolean> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot delete satellite receiver: Supabase not configured');
      return false;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for delete');
      return false;
    }

    console.log(`Attempting to delete satellite receiver with ID: ${id}`);

    const { data: existingReceiver, error: checkError } = await getAuthenticatedSupabase()
      .from('satellite_receivers')
      .select('id, name')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('deleteSatelliteReceiver - existence check', checkError, { id });
      return false;
    }

    if (!existingReceiver) {
      console.error(`Satellite receiver not found with ID: ${id}`);
      return false;
    }

    console.log(`Deleting receiver: ${existingReceiver.name}`);

    const { error: deleteError } = await getAuthenticatedSupabase()
      .from('satellite_receivers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logError('deleteSatelliteReceiver - delete operation', deleteError, { id });
      return false;
    }

    console.log('Satellite receiver deleted successfully');
    return true;
  } catch (error) {
    logError('deleteSatelliteReceiver', error, { id });
    return false;
  }
};

// Accessories Functions
export const getAccessories = async (): Promise<Accessory[]> => {
  try {
    if (!checkSupabaseConfig()) {
      return [];
    }

    console.log('Fetching accessories...');
    
    const { data, error } = await getAuthenticatedSupabase()
      .from('accessories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logError('getAccessories', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} accessories`);
    return data || [];
  } catch (error) {
    logError('getAccessories', error);
    return [];
  }
};

export const saveAccessory = async (accessory: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>): Promise<Accessory | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot save accessory: Supabase not configured');
      return null;
    }

    if (!accessory.name?.trim() || !accessory.price?.trim() || !accessory.purchase_url?.trim() || !accessory.category?.trim()) {
      console.error('Validation failed: Required fields missing');
      return null;
    }

    const accessoryData = {
      name: accessory.name.trim(),
      price: accessory.price.trim(),
      description: accessory.description?.trim() || '',
      image_url: accessory.image_url?.trim() || 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400',
      purchase_url: accessory.purchase_url.trim(),
      category: accessory.category.trim(),
      is_available: accessory.is_available ?? true
    };

    console.log('Saving new accessory:', accessoryData);

    const { data, error } = await getAuthenticatedSupabase()
      .from('accessories')
      .insert(accessoryData)
      .select()
      .single();

    if (error) {
      logError('saveAccessory', error, accessoryData);
      return null;
    }

    console.log('Accessory saved successfully:', data);
    return data;
  } catch (error) {
    logError('saveAccessory', error, accessory);
    return null;
  }
};

export const updateAccessory = async (id: string, accessory: Partial<Accessory>): Promise<Accessory | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot update accessory: Supabase not configured');
      return null;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for update');
      return null;
    }

    console.log(`Starting update for accessory ID: ${id}`);

    const { data: existingAccessory, error: checkError } = await getAuthenticatedSupabase()
      .from('accessories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('updateAccessory - existence check', checkError, { id });
      return null;
    }

    if (!existingAccessory) {
      console.error(`No accessory found with ID: ${id}`);
      return null;
    }

    const updateData: any = {};
    
    if (accessory.name !== undefined) {
      if (!accessory.name.trim()) {
        console.error('Validation failed: Name cannot be empty');
        return null;
      }
      updateData.name = accessory.name.trim();
    }
    
    if (accessory.price !== undefined) {
      if (!accessory.price.trim()) {
        console.error('Validation failed: Price cannot be empty');
        return null;
      }
      updateData.price = accessory.price.trim();
    }
    
    if (accessory.description !== undefined) {
      updateData.description = accessory.description?.trim() || '';
    }
    
    if (accessory.image_url !== undefined) {
      updateData.image_url = accessory.image_url?.trim() || 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    
    if (accessory.purchase_url !== undefined) {
      if (!accessory.purchase_url.trim()) {
        console.error('Validation failed: Purchase URL cannot be empty');
        return null;
      }
      updateData.purchase_url = accessory.purchase_url.trim();
    }
    
    if (accessory.category !== undefined) {
      if (!accessory.category.trim()) {
        console.error('Validation failed: Category cannot be empty');
        return null;
      }
      updateData.category = accessory.category.trim();
    }
    
    if (accessory.is_available !== undefined) {
      updateData.is_available = accessory.is_available;
    }

    if (Object.keys(updateData).length === 0) {
      console.log('No changes detected, returning existing accessory');
      return existingAccessory;
    }

    const { data: updatedData, error: updateError } = await getAuthenticatedSupabase()
      .from('accessories')
      .update(updateData)
      .eq('id', id)
      .select('*');

    if (updateError) {
      logError('updateAccessory - update operation', updateError, { id, updateData });
      return null;
    }

    if (!updatedData || updatedData.length === 0) {
      console.log('Update operation completed but no rows were affected');
      return existingAccessory;
    }

    const updatedAccessory = updatedData[0];
    console.log('Accessory updated successfully:', updatedAccessory);
    return updatedAccessory;
  } catch (error) {
    logError('updateAccessory', error, { id, accessory });
    return null;
  }
};

export const deleteAccessory = async (id: string): Promise<boolean> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot delete accessory: Supabase not configured');
      return false;
    }

    if (!id?.trim()) {
      console.error('Validation failed: Valid ID is required for delete');
      return false;
    }

    console.log(`Attempting to delete accessory with ID: ${id}`);

    const { data: existingAccessory, error: checkError } = await getAuthenticatedSupabase()
      .from('accessories')
      .select('id, name')
      .eq('id', id)
      .maybeSingle();

    if (checkError) {
      logError('deleteAccessory - existence check', checkError, { id });
      return false;
    }

    if (!existingAccessory) {
      console.error(`Accessory not found with ID: ${id}`);
      return false;
    }

    console.log(`Deleting accessory: ${existingAccessory.name}`);

    const { error: deleteError } = await getAuthenticatedSupabase()
      .from('accessories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logError('deleteAccessory - delete operation', deleteError, { id });
      return false;
    }

    console.log('Accessory deleted successfully');
    return true;
  } catch (error) {
    logError('deleteAccessory', error, { id });
    return false;
  }
};

// Admin Settings Functions
export const getAdminData = async (): Promise<AdminData> => {
  try {
    if (!checkSupabaseConfig()) {
      // Return default data when Supabase is not configured
      return {
        service_name: 'TechnSat chez Wassim',
        available_apps: [
          'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
          'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
          'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
          'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
          'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
          'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
        ]
      };
    }

    console.log('Fetching admin settings...');
    
    const { data, error } = await getAuthenticatedSupabase()
      .from('admin_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logError('getAdminData', error);
    }

    if (!data) {
      console.log('No admin settings found, returning defaults');
      // Return default data if no settings exist
      return {
        service_name: 'TechnSat chez Wassim',
        available_apps: [
          'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
          'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
          'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
          'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
          'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
          'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
        ]
      };
    }

    console.log('Admin settings fetched successfully:', data);
    return data;
  } catch (error) {
    logError('getAdminData', error);
    return {
      service_name: 'TechnSat chez Wassim',
      available_apps: [
        'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
        'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
        'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
        'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
        'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
        'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
      ]
    };
  }
};

export const saveAdminData = async (adminData: Partial<AdminData>): Promise<AdminData | null> => {
  try {
    if (!checkSupabaseConfig()) {
      console.error('Cannot save admin data: Supabase not configured');
      return null;
    }

    console.log('Saving admin data:', adminData);

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session for admin data save:', session ? 'authenticated' : 'not authenticated');

    // First, try to get existing settings
    const { data: existing, error: fetchError } = await getAuthenticatedSupabase()
      .from('admin_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      logError('saveAdminData - fetch existing', fetchError);
      return null;
    }

    if (existing) {
      // Update existing settings
      const updateData = {
        service_name: adminData.service_name?.trim() || existing.service_name,
        available_apps: adminData.available_apps || existing.available_apps
      };

      console.log('Updating existing admin data:', updateData);

      const { data, error } = await getAuthenticatedSupabase()
        .from('admin_settings')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        logError('saveAdminData - update', error, updateData);
        
        if (error.code === '42501') {
          console.error('RLS Policy Error during admin data update: Make sure you are authenticated and have proper permissions');
        }
        
        return null;
      }

      console.log('Admin data updated successfully:', data);
      return data;
    } else {
      // Create new settings
      const insertData = {
        service_name: adminData.service_name?.trim() || 'TechnSat chez Wassim',
        available_apps: adminData.available_apps || [
          'MTNPlus', 'Orca Plus 4K', 'Orca Pro+', 'ESPRO', 'ZEBRA', 'OTT MTN EXTREAM',
          'Best IPTV HD', 'STRONG 4K', 'BD TV', '24 Live IPTV Page', 'Pro Max TV Player',
          'X2 Smart', 'Android Media Box', 'Crazy TV Max', 'شاهد BeIN', 'AIS PLAY',
          'MATADOR', 'MB Sat OTT-Pro TV', 'NEO TV PRO', 'COMBO IPTV', 'MY HD PREMIER',
          'Downloader', 'MAX OTT', 'YouTube', 'ULTRA IPTV', 'MTN OTT STORE', 'SAM IPTV',
          'BUENO TV', 'M TV', 'AP-LIVE WORLD CHANNELS'
        ]
      };

      console.log('Creating new admin data:', insertData);

      const { data, error } = await getAuthenticatedSupabase()
        .from('admin_settings')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        logError('saveAdminData - insert', error, insertData);
        
        if (error.code === '42501') {
          console.error('RLS Policy Error during admin data insert: Make sure you are authenticated and have proper permissions');
        }
        
        return null;
      }

      console.log('Admin data created successfully:', data);
      return data;
    }
  } catch (error) {
    logError('saveAdminData', error, adminData);
    return null;
  }
};

// Real-time subscription functions with enhanced error handling
export const subscribeToOffers = (callback: (offers: IPTVOffer[]) => void) => {
  if (!checkSupabaseConfig()) {
    console.warn('Cannot subscribe to offers: Supabase not configured');
    return { unsubscribe: () => {} };
  }

  const channelName = `iptv_offers_${Date.now()}_${Math.random()}`;
  
  console.log(`Setting up real-time subscription for IPTV offers: ${channelName}`);
  
  const subscription = supabase
    .channel(channelName)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'iptv_offers' 
      }, 
      async (payload) => {
        try {
          console.log('IPTV offers change detected:', payload.eventType, payload.new || payload.old);
          // Add a small delay to ensure database consistency
          setTimeout(async () => {
            try {
              const offers = await getOffers();
              callback(offers);
            } catch (error) {
              logError('subscribeToOffers - callback', error);
            }
          }, 100);
        } catch (error) {
          logError('subscribeToOffers - event handler', error, payload);
        }
      }
    )
    .subscribe((status) => {
      console.log(`IPTV offers subscription status [${channelName}]:`, status);
    });

  return subscription;
};

export const subscribeToAndroidBoxes = (callback: (boxes: AndroidBox[]) => void) => {
  if (!checkSupabaseConfig()) {
    console.warn('Cannot subscribe to Android boxes: Supabase not configured');
    return { unsubscribe: () => {} };
  }

  const channelName = `android_boxes_${Date.now()}_${Math.random()}`;
  
  console.log(`Setting up real-time subscription for Android boxes: ${channelName}`);
  
  const subscription = supabase
    .channel(channelName)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'android_boxes' 
      }, 
      async (payload) => {
        try {
          console.log('Android boxes change detected:', payload.eventType, payload.new || payload.old);
          // Add a small delay to ensure database consistency
          setTimeout(async () => {
            try {
              const boxes = await getAndroidBoxes();
              callback(boxes);
            } catch (error) {
              logError('subscribeToAndroidBoxes - callback', error);
            }
          }, 100);
        } catch (error) {
          logError('subscribeToAndroidBoxes - event handler', error, payload);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Android boxes subscription status [${channelName}]:`, status);
    });

  return subscription;
};

export const subscribeToAdminSettings = (callback: (adminData: AdminData) => void) => {
  if (!checkSupabaseConfig()) {
    console.warn('Cannot subscribe to admin settings: Supabase not configured');
    return { unsubscribe: () => {} };
  }

  const channelName = `admin_settings_${Date.now()}_${Math.random()}`;
  
  console.log(`Setting up real-time subscription for admin settings: ${channelName}`);
  
  const subscription = supabase
    .channel(channelName)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'admin_settings' 
      }, 
      async (payload) => {
        try {
          console.log('Admin settings change detected:', payload.eventType, payload.new || payload.old);
          // Add a small delay to ensure database consistency
          setTimeout(async () => {
            try {
              const adminData = await getAdminData();
              callback(adminData);
            } catch (error) {
              logError('subscribeToAdminSettings - callback', error);
            }
          }, 100);
        } catch (error) {
          logError('subscribeToAdminSettings - event handler', error, payload);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Admin settings subscription status [${channelName}]:`, status);
    });

  return subscription;
};

// Real-time subscription functions for new tables
export const subscribeToSatelliteReceivers = (callback: (receivers: SatelliteReceiver[]) => void) => {
  if (!checkSupabaseConfig()) {
    console.warn('Cannot subscribe to satellite receivers: Supabase not configured');
    return { unsubscribe: () => {} };
  }

  const channelName = `satellite_receivers_${Date.now()}_${Math.random()}`;
  
  console.log(`Setting up real-time subscription for satellite receivers: ${channelName}`);
  
  const subscription = supabase
    .channel(channelName)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'satellite_receivers' 
      }, 
      async (payload) => {
        try {
          console.log('Satellite receivers change detected:', payload.eventType, payload.new || payload.old);
          setTimeout(async () => {
            try {
              const receivers = await getSatelliteReceivers();
              callback(receivers);
            } catch (error) {
              logError('subscribeToSatelliteReceivers - callback', error);
            }
          }, 100);
        } catch (error) {
          logError('subscribeToSatelliteReceivers - event handler', error, payload);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Satellite receivers subscription status [${channelName}]:`, status);
    });

  return subscription;
};

export const subscribeToAccessories = (callback: (accessories: Accessory[]) => void) => {
  if (!checkSupabaseConfig()) {
    console.warn('Cannot subscribe to accessories: Supabase not configured');
    return { unsubscribe: () => {} };
  }

  const channelName = `accessories_${Date.now()}_${Math.random()}`;
  
  console.log(`Setting up real-time subscription for accessories: ${channelName}`);
  
  const subscription = supabase
    .channel(channelName)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'accessories' 
      }, 
      async (payload) => {
        try {
          console.log('Accessories change detected:', payload.eventType, payload.new || payload.old);
          setTimeout(async () => {
            try {
              const accessories = await getAccessories();
              callback(accessories);
            } catch (error) {
              logError('subscribeToAccessories - callback', error);
            }
          }, 100);
        } catch (error) {
          logError('subscribeToAccessories - event handler', error, payload);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Accessories subscription status [${channelName}]:`, status);
    });

  return subscription;
};