import { supabase } from '@/integrations/supabase/client';

export interface ConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate?: Date;
  message?: string;
}

export async function createConsultationRequest(consultationData: ConsultationFormData) {
  try {
    console.log('Creating consultation request with data:', consultationData);
    
    const { data, error } = await supabase
      .from('consultation_requests')
      .insert([
        {
          full_name: consultationData.fullName,
          email: consultationData.email,
          phone: consultationData.phone,
          consultation_type: consultationData.consultationType,
          preferred_date: consultationData.preferredDate?.toISOString().split('T')[0],
          message: consultationData.message,
        }
      ])
      .select();

    if (error) {
      console.error('Error creating consultation request:', error);
      throw error;
    }

    console.log('Consultation request created successfully:', data);

    // Send confirmation email to customer and notification to admin
    if (data && data[0]) {
      try {
        console.log('Sending consultation emails...');
        
        const emailPromises = [
          // Send confirmation email to customer
          supabase.functions.invoke('send-gmail', {
            body: {
              type: 'consultation_confirmation',
              data: {
                fullName: consultationData.fullName,
                email: consultationData.email,
                phone: consultationData.phone,
                consultationType: consultationData.consultationType,
                preferredDate: consultationData.preferredDate?.toISOString().split('T')[0],
                message: consultationData.message,
                consultationId: data[0].id,
              }
            }
          }),
          // Send notification email to admin
          supabase.functions.invoke('send-gmail', {
            body: {
              type: 'consultation_notification',
              data: {
                fullName: consultationData.fullName,
                email: consultationData.email,
                phone: consultationData.phone,
                consultationType: consultationData.consultationType,
                preferredDate: consultationData.preferredDate?.toISOString().split('T')[0],
                message: consultationData.message,
                consultationId: data[0].id,
              }
            }
          })
        ];
        
        const emailResults = await Promise.allSettled(emailPromises);
        console.log('Email results:', emailResults);
        
        // Check if both emails were successful
        const failedEmails = emailResults.filter(result => result.status === 'rejected');
        if (failedEmails.length > 0) {
          console.error('Some emails failed to send:', failedEmails);
          // Don't fail the consultation creation if emails fail
        } else {
          console.log('All consultation emails sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending consultation emails:', emailError);
        // Don't fail the consultation creation if email fails
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createConsultationRequest:', error);
    return { success: false, error };
  }
}

export async function getConsultationRequests(status?: string) {
  try {
    let query = supabase
      .from('consultation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching consultation requests:', error);
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error in getConsultationRequests:', error);
    return { success: false, data: [], error };
  }
}

export async function updateConsultationStatus(consultationId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('consultation_requests')
      .update({ status })
      .eq('id', consultationId)
      .select();

    if (error) {
      console.error('Error updating consultation status:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateConsultationStatus:', error);
    return { success: false, error };
  }
}