'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MedicalRecord {
  appointment_id: number;
  patient_name: string;
  age: number;
  gender: string;
  patient_email: string;
  phone: string;
  reason: string;
  doctor_id: number;
  status: string;
  address: string;
  doctor_confirmation: string;
  doctor_note: string;
  diagnosis: string;
  follow_up_date: string;
  is_examined: number;
  customer_name: string;
  customer_id: number;
  doctor_name: string;
  doctor_phone: string;
  doctor_email: string;
  specialization_name: string;
  start_time: string;
  end_time: string;
  slot_date: string;
  medical_record_id: number;
  treatment: string;
  medical_notes: string;
  medical_record_created_at?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'by-doctors'>('all');
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Array<{id: number, name: string}>>([]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: search,
        status: statusFilter === 'all' ? '' : statusFilter,
        doctor_id: doctorFilter === 'all' ? '' : doctorFilter,
        type: activeTab === 'all' ? 'all' : 'by-doctors'
      });

      const response = await fetch(`/api/admin/medical-records?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setRecords(data.records);
        setPagination(data.pagination);
      } else {
        console.error('Lỗi khi tải dữ liệu:', data.error);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors');
      const data = await response.json();
      if (response.ok) {
        setDoctors(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách bác sĩ:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search, statusFilter, doctorFilter, activeTab]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRecords();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDoctorFilter('all');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      'Chưa xác nhận': { variant: 'outline', label: 'Chưa xác nhận' },
      'Đã xác nhận': { variant: 'default', label: 'Đã xác nhận' },
      'Từ chối': { variant: 'destructive', label: 'Từ chối' },
      'Đã hủy': { variant: 'destructive', label: 'Đã hủy' },
      'Đang khám': { variant: 'secondary', label: 'Đang khám' },
      'Đã khám xong': { variant: 'default', label: 'Đã khám xong' }
    };

    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const openDetailModal = async (record: MedicalRecord) => {
    try {
      const response = await fetch(`/api/admin/medical-records/${record.appointment_id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSelectedRecord(data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ bệnh án</h1>
        <p className="text-gray-600">Quản lý và xem hồ sơ bệnh án của tất cả bệnh nhân</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tất cả hồ sơ bệnh án
            </button>
            <button
              onClick={() => setActiveTab('by-doctors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'by-doctors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hồ sơ của các bác sĩ
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm bệnh nhân
              </label>
              <Input
                placeholder="Nhập tên bệnh nhân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Chưa xác nhận">Chưa xác nhận</SelectItem>
                  <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                  <SelectItem value="Từ chối">Từ chối</SelectItem>
                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                  <SelectItem value="Đang khám">Đang khám</SelectItem>
                  <SelectItem value="Đã khám xong">Đã khám xong</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bác sĩ
              </label>
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả bác sĩ</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                Tìm kiếm
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {activeTab === 'all' ? 'Danh sách hồ sơ bệnh án' : 'Hồ sơ bệnh án của các bác sĩ'}
            </span>
            {pagination && (
              <span className="text-sm text-gray-500">
                Hiển thị {records.length} / {pagination.totalRecords} hồ sơ
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? 'Không tìm thấy hồ sơ bệnh án nào' 
                  : 'Không tìm thấy hồ sơ bệnh án nào của các bác sĩ'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.appointment_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {record.patient_name?.charAt(0) || 'N'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{record.patient_name}</h3>
                          <p className="text-sm text-gray-600">
                            {record.age} tuổi • {record.gender} • {record.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <User className="inline h-4 w-4 mr-1" />
                            Bác sĩ: <span className="font-medium">{record.doctor_name}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <Stethoscope className="inline h-4 w-4 mr-1" />
                            Chuyên khoa: <span className="font-medium">{record.specialization_name}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Ngày khám: {record.slot_date ? format(new Date(record.slot_date), 'dd/MM/yyyy', { locale: vi }) : 'Chưa có'}
                          </p>
                          {activeTab === 'by-doctors' && record.medical_record_created_at && (
                            <p className="text-sm text-gray-600">
                              <FileText className="inline h-4 w-4 mr-1" />
                              Ngày tạo hồ sơ: {format(new Date(record.medical_record_created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Giờ khám: {record.start_time} - {record.end_time}
                          </p>
                          <p className="text-sm text-gray-600">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Địa chỉ: {record.address || 'Chưa có'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Mail className="inline h-4 w-4 mr-1" />
                            Email: {record.patient_email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm">
                          <span className="font-medium">Lý do khám:</span> {record.reason}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(record.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDetailModal(record)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ bệnh án</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin bệnh nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên</p>
                    <p className="font-medium">{selectedRecord.patient_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tuổi</p>
                    <p className="font-medium">{selectedRecord.age} tuổi</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giới tính</p>
                    <p className="font-medium">{selectedRecord.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium">{selectedRecord.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedRecord.patient_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-medium">{selectedRecord.address || 'Chưa có'}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Thông tin bác sĩ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên bác sĩ</p>
                    <p className="font-medium">{selectedRecord.doctor_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chuyên khoa</p>
                    <p className="font-medium">{selectedRecord.specialization_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium">{selectedRecord.doctor_phone || 'Chưa có'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedRecord.doctor_email || 'Chưa có'}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thông tin lịch hẹn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ngày khám</p>
                    <p className="font-medium">
                      {selectedRecord.slot_date ? format(new Date(selectedRecord.slot_date), 'dd/MM/yyyy', { locale: vi }) : 'Chưa có'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giờ khám</p>
                    <p className="font-medium">{selectedRecord.start_time} - {selectedRecord.end_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đã khám</p>
                    <p className="font-medium">{selectedRecord.is_examined ? 'Có' : 'Chưa'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Lý do khám</p>
                  <p className="font-medium">{selectedRecord.reason}</p>
                </div>
              </div>

              {/* Medical Information */}
              {(selectedRecord.diagnosis || selectedRecord.doctor_note || selectedRecord.treatment || selectedRecord.medical_notes) && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin y tế
                  </h3>
                  <div className="space-y-4">
                    {selectedRecord.diagnosis && (
                      <div>
                        <p className="text-sm text-gray-600">Chẩn đoán</p>
                        <p className="font-medium">{selectedRecord.diagnosis}</p>
                      </div>
                    )}
                    {selectedRecord.doctor_note && (
                      <div>
                        <p className="text-sm text-gray-600">Ghi chú của bác sĩ</p>
                        <p className="font-medium">{selectedRecord.doctor_note}</p>
                      </div>
                    )}
                    {selectedRecord.treatment && (
                      <div>
                        <p className="text-sm text-gray-600">Điều trị</p>
                        <p className="font-medium">{selectedRecord.treatment}</p>
                      </div>
                    )}
                    {selectedRecord.medical_notes && (
                      <div>
                        <p className="text-sm text-gray-600">Ghi chú hồ sơ bệnh án</p>
                        <p className="font-medium">{selectedRecord.medical_notes}</p>
                      </div>
                    )}
                    {selectedRecord.follow_up_date && (
                      <div>
                        <p className="text-sm text-gray-600">Ngày tái khám</p>
                        <p className="font-medium">
                          {format(new Date(selectedRecord.follow_up_date), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 