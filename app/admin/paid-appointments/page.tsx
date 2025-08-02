"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  Eye
} from "lucide-react";

interface PaidAppointment {
  id: number;
  patient_name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  reason: string;
  address: string;
  payment_status: string;
  payment_method: string;
  transaction_id: string;
  paid_amount: number;
  payment_date: string;
  status: string;
  doctor_confirmation: string;
  doctor_note: string;
  diagnosis: string;
  follow_up_date: string;
  is_examined: number;
  doctor_name: string;
  doctor_phone: string;
  doctor_email: string;
  specialization_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
}

interface PaymentStats {
  period: string;
  total_appointments: number;
  total_revenue: number;
  avg_amount: number;
}

export default function PaidAppointmentsPage() {
  const [appointments, setAppointments] = useState<PaidAppointment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [statsPeriod, setStatsPeriod] = useState("month");

  useEffect(() => {
    loadPaidAppointments();
    loadPaymentStats();
  }, [currentPage, search, paymentMethod, dateFrom, dateTo]);

  useEffect(() => {
    loadPaymentStats();
  }, [statsPeriod]);

  const loadPaidAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(search && { search }),
        ...(paymentMethod && paymentMethod !== 'all' && { payment_method: paymentMethod }),
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      });

      const response = await fetch(`http://localhost:5000/api/admin/paid-appointments?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
        setTotalPages(data.pagination.totalPages);
        setTotalRecords(data.pagination.totalRecords);
        setTotalRevenue(data.totalRevenue);
      } else {
        throw new Error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error loading paid appointments:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lịch hẹn đã thanh toán",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/payment-stats?period=${statsPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentStats(data);
      }
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPaidAppointments();
  };

  const handleReset = () => {
    setSearch("");
    setPaymentMethod("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getPaymentMethodIcon = (method: string) => {
    return method === 'online' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Chưa xác nhận': { variant: 'secondary' as const, text: 'Chưa xác nhận' },
      'Đã xác nhận': { variant: 'default' as const, text: 'Đã xác nhận' },
      'Từ chối': { variant: 'destructive' as const, text: 'Từ chối' },
      'Đã hủy': { variant: 'destructive' as const, text: 'Đã hủy' },
      'Đang khám': { variant: 'default' as const, text: 'Đang khám' },
      'Đã khám xong': { variant: 'default' as const, text: 'Đã khám xong' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lịch Hẹn Đã Thanh Toán</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các lịch hẹn đã thanh toán thành công
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <Filter className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Lịch Hẹn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Lịch hẹn đã thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Tổng tiền đã thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung Bình</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRecords > 0 ? formatCurrency(totalRevenue / totalRecords) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Trung bình mỗi lịch hẹn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thống Kê</CardTitle>
            <Select value={statsPeriod} onValueChange={setStatsPeriod}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Ngày</SelectItem>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentStats.length > 0 ? formatCurrency(paymentStats[0].total_revenue) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsPeriod === 'day' ? 'Hôm nay' : statsPeriod === 'week' ? 'Tuần này' : 'Tháng này'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ Lọc Tìm Kiếm</CardTitle>
          <CardDescription>Tìm kiếm và lọc lịch hẹn đã thanh toán</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input
                id="search"
                placeholder="Tên, email, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div>
              <Label htmlFor="payment-method">Phương thức thanh toán</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-from">Từ ngày</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-to">Đến ngày</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={handleReset}>
              Xóa bộ lọc
            </Button>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Lịch Hẹn Đã Thanh Toán</CardTitle>
          <CardDescription>
            Hiển thị {appointments.length} trong tổng số {totalRecords} lịch hẹn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Bác sĩ</TableHead>
                    <TableHead>Lịch hẹn</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{appointment.patient_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {appointment.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {appointment.phone}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{appointment.doctor_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.specialization_name}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(appointment.slot_date)}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {appointment.start_time} - {appointment.end_time}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-green-600">
                            {formatCurrency(appointment.paid_amount)}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            {getPaymentMethodIcon(appointment.payment_method)}
                            <span className="ml-1">
                              {appointment.payment_method === 'online' ? 'Online' : 'Tiền mặt'}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDateTime(appointment.payment_date)}
                          </div>
                          {appointment.transaction_id && (
                            <div className="text-xs text-muted-foreground">
                              ID: {appointment.transaction_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 