import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConsultationResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    consultation_type: string;
    preferred_date?: string;
    message?: string;
  } | null;
  onSuccess: () => void;
}

const ConsultationResponseModal: React.FC<ConsultationResponseModalProps> = ({
  isOpen,
  onClose,
  consultation,
  onSuccess
}) => {
  const [response, setResponse] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultation || !response.trim()) return;

    setSending(true);
    try {
      // Update consultation status to 'responded'
      const { error: updateError } = await supabase
        .from('consultation_requests')
        .update({ status: 'responded' })
        .eq('id', consultation.id);

      if (updateError) {
        throw updateError;
      }

      // Send response email to customer
      const { error: emailError } = await supabase.functions.invoke('send-gmail', {
        body: {
          type: 'consultation_response',
          data: {
            fullName: consultation.full_name,
            email: consultation.email,
            phone: consultation.phone,
            consultationType: consultation.consultation_type,
            preferredDate: consultation.preferred_date,
            message: consultation.message,
            consultationId: consultation.id,
            adminResponse: response,
          }
        }
      });

      if (emailError) {
        console.error('Error sending response email:', emailError);
        toast.success('Đã cập nhật trạng thái nhưng không thể gửi email');
      } else {
        toast.success('Đã gửi phản hồi thành công!');
      }

      onSuccess();
      onClose();
      setResponse('');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setSending(false);
    }
  };

  const getConsultationTypeText = (type: string) => {
    switch (type) {
      case 'accommodation':
        return 'Tư vấn lưu trú';
      case 'tourism':
        return 'Tư vấn du lịch';
      case 'events':
        return 'Tư vấn sự kiện';
      case 'other':
        return 'Tư vấn khác';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Phản hồi tư vấn</DialogTitle>
          <DialogDescription>
            Gửi phản hồi tư vấn cho khách hàng qua email
          </DialogDescription>
        </DialogHeader>

        {consultation && (
          <div className="space-y-4">
            {/* Customer Information */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><strong>Họ tên:</strong> {consultation.full_name}</p>
                <p><strong>Email:</strong> {consultation.email}</p>
                <p><strong>Điện thoại:</strong> {consultation.phone}</p>
                <p><strong>Loại tư vấn:</strong> {getConsultationTypeText(consultation.consultation_type)}</p>
                {consultation.preferred_date && (
                  <p><strong>Ngày mong muốn:</strong> {consultation.preferred_date}</p>
                )}
              </div>
              {consultation.message && (
                <div className="mt-3">
                  <strong>Nội dung:</strong>
                  <p className="mt-1 text-sm bg-background p-2 rounded border">
                    {consultation.message}
                  </p>
                </div>
              )}
            </div>

            {/* Response Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="response">Nội dung phản hồi *</Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Nhập nội dung phản hồi tư vấn..."
                  className="mt-1 min-h-[120px]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nội dung này sẽ được gửi trực tiếp đến email của khách hàng
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={!response.trim() || sending}>
                  {sending ? 'Đang gửi...' : 'Gửi phản hồi'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationResponseModal;