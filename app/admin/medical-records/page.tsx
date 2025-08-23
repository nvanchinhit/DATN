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
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  appointment_diagnosis?: string;
  medical_record_diagnosis?: string;
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
  // Các trường dữ liệu sinh hiệu mới
  temperature?: number | null;
  blood_pressure?: number | null;
  heart_rate?: number | null;
  weight?: number | null;
  height?: number | null;
  symptoms?: string[] | null;
  allergies?: string[] | null;
  medications?: string[] | null;
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
  const [dateFilter, setDateFilter] = useState('');
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
        date: dateFilter,
        type: activeTab === 'all' ? 'all' : 'by-doctors'
      });

      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/medical-records?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
  }, [currentPage, search, statusFilter, doctorFilter, dateFilter, activeTab]);

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
    setDateFilter('');
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
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/medical-records/${record.appointment_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Ngày khám
               </label>
               <Input
                 type="date"
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
                 className="w-full"
               />
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
                        {record.medical_record_diagnosis && (
                          <p className="text-sm mt-1">
                            <span className="font-medium text-blue-600">Chẩn đoán của bác sĩ:</span> {record.medical_record_diagnosis}
                          </p>
                        )}
                      </div>

                      {/* Hiển thị chỉ số sinh hiệu nếu có */}
                      {(record.temperature || record.blood_pressure || record.heart_rate || record.weight || record.height) && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Chỉ số sinh hiệu:</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.temperature && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                🌡️ {record.temperature}°C
                              </span>
                            )}
                            {record.blood_pressure && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                💓 {record.blood_pressure} mmHg
                              </span>
                            )}
                            {record.heart_rate && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                ❤️ {record.heart_rate} lần/phút
                              </span>
                            )}
                            {record.weight && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                ⚖️ {record.weight} kg
                              </span>
                            )}
                            {record.height && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                📏 {record.height} cm
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Hiển thị danh sách triệu chứng, dị ứng, thuốc nếu có */}
                      {(record.symptoms || record.allergies || record.medications) && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">📋 Thông tin bổ sung:</h4>
                          <div className="space-y-2">
                            {record.symptoms && record.symptoms.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-red-600">🩺 Triệu chứng:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {record.symptoms.map((symptom, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {record.allergies && record.allergies.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-yellow-600">⚠️ Dị ứng:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {record.allergies.map((allergy, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                      {allergy}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {record.medications && record.medications.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-blue-600">💊 Thuốc đang dùng:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {record.medications.map((medication, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                      {medication}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
              {(selectedRecord.medical_record_diagnosis || selectedRecord.appointment_diagnosis || selectedRecord.doctor_note || selectedRecord.treatment || selectedRecord.medical_notes) && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin y tế
                  </h3>
                  <div className="space-y-4">
                    {selectedRecord.medical_record_diagnosis && (
                      <div>
                        <p className="text-sm text-gray-600">Chẩn đoán của bác sĩ</p>
                        <p className="font-medium text-blue-600">{selectedRecord.medical_record_diagnosis}</p>
                      </div>
                    )}
                    {selectedRecord.appointment_diagnosis && !selectedRecord.medical_record_diagnosis && (
                      <div>
                        <p className="text-sm text-gray-600">Chẩn đoán</p>
                        <p className="font-medium">{selectedRecord.appointment_diagnosis}</p>
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

              {/* Vital Signs & Additional Information */}
              {(selectedRecord.temperature || selectedRecord.blood_pressure || selectedRecord.heart_rate || selectedRecord.weight || selectedRecord.height || 
                selectedRecord.symptoms || selectedRecord.allergies || selectedRecord.medications) && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Chỉ số sinh hiệu & Thông tin bổ sung
                  </h3>
                  
                  {/* Chỉ số sinh hiệu */}
                  {(selectedRecord.temperature || selectedRecord.blood_pressure || selectedRecord.heart_rate || selectedRecord.weight || selectedRecord.height) && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Chỉ số sinh hiệu:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedRecord.temperature && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="text-xs text-blue-600 font-medium mb-1">🌡️ Nhiệt độ</div>
                            <div className="text-lg font-bold text-blue-800">{selectedRecord.temperature}°C</div>
                          </div>
                        )}
                        {selectedRecord.blood_pressure && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="text-xs text-green-600 font-medium mb-1">💓 Huyết áp</div>
                            <div className="text-lg font-bold text-green-800">{selectedRecord.blood_pressure} mmHg</div>
                          </div>
                        )}
                        {selectedRecord.heart_rate && (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <div className="text-xs text-red-600 font-medium mb-1">❤️ Nhịp tim</div>
                            <div className="text-lg font-bold text-red-800">{selectedRecord.heart_rate} lần/phút</div>
                          </div>
                        )}
                        {selectedRecord.weight && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="text-xs text-purple-600 font-medium mb-1">⚖️ Cân nặng</div>
                            <div className="text-lg font-bold text-purple-800">{selectedRecord.weight} kg</div>
                          </div>
                        )}
                        {selectedRecord.height && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <div className="text-xs text-orange-600 font-medium mb-1">📏 Chiều cao</div>
                            <div className="text-lg font-bold text-orange-800">{selectedRecord.height} cm</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Danh sách triệu chứng, dị ứng, thuốc */}
                  <div className="space-y-4">
                    {selectedRecord.symptoms && selectedRecord.symptoms.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="mr-2">🩺</span>
                          Danh sách triệu chứng
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.symptoms.map((symptom, index) => (
                            <span key={index} className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full border border-red-300">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedRecord.allergies && selectedRecord.allergies.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="mr-2">⚠️</span>
                          Danh sách dị ứng
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.allergies.map((allergy, index) => (
                            <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full border border-yellow-300">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="mr-2">💊</span>
                          Danh sách thuốc đang dùng
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.medications.map((medication, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-300">
                              {medication}
                            </span>
                          ))}
                        </div>
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