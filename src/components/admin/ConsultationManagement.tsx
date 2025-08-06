import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Clock, CheckCircle, XCircle, MessageSquare, Reply } from 'lucide-react';
import { toast } from 'sonner';
import { getConsultationRequests, updateConsultationStatus } from '@/api/consultationApi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ConsultationResponseModal from './ConsultationResponseModal';

interface ConsultationRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  consultation_type: string;
  preferred_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const ConsultationManagement = () => {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, [selectedStatus]);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const result = await getConsultationRequests(selectedStatus === 'all' ? undefined : selectedStatus);
      if (result.success) {
        setConsultations(result.data);
      } else {
        toast.error('Lỗi khi tải danh sách tư vấn');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Lỗi khi tải danh sách tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (consultationId: string, newStatus: string) => {
    try {
      const result = await updateConsultationStatus(consultationId, newStatus);
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchConsultations(); // Refresh the list
      } else {
        toast.error('Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Chờ xử lý</Badge>;
      case 'contacted':
        return <Badge variant="default" className="gap-1"><MessageSquare className="w-3 h-3" />Đã liên hệ</Badge>;
      case 'responded':
        return <Badge variant="default" className="gap-1 bg-blue-500"><Reply className="w-3 h-3" />Đã phản hồi</Badge>;
      case 'completed':
        return <Badge variant="default" className="gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Hủy bỏ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý yêu cầu tư vấn</h2>
        <div className="flex gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="contacted">Đã liên hệ</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Hủy bỏ</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchConsultations} variant="outline">
            Làm mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Danh sách yêu cầu tư vấn ({consultations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có yêu cầu tư vấn nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Loại tư vấn</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Ngày mong muốn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{consultation.full_name}</p>
                          <p className="text-sm text-gray-500">{consultation.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getConsultationTypeText(consultation.consultation_type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{consultation.phone}</p>
                          {consultation.message && (
                            <p className="text-gray-500 truncate max-w-xs" title={consultation.message}>
                              {consultation.message}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {consultation.preferred_date 
                          ? format(new Date(consultation.preferred_date), 'dd/MM/yyyy', { locale: vi })
                          : 'Không xác định'
                        }
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(consultation.status)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(consultation.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedConsultation(consultation);
                              setResponseModalOpen(true);
                            }}
                            className="gap-1"
                          >
                            <Reply className="w-3 h-3" />
                            Phản hồi
                          </Button>
                          <Select
                            value={consultation.status}
                            onValueChange={(value) => handleStatusUpdate(consultation.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Chờ xử lý</SelectItem>
                              <SelectItem value="contacted">Đã liên hệ</SelectItem>
                              <SelectItem value="responded">Đã phản hồi</SelectItem>
                              <SelectItem value="completed">Hoàn thành</SelectItem>
                              <SelectItem value="cancelled">Hủy bỏ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConsultationResponseModal
        isOpen={responseModalOpen}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedConsultation(null);
        }}
        consultation={selectedConsultation}
        onSuccess={fetchConsultations}
      />
    </div>
  );
};

export default ConsultationManagement;