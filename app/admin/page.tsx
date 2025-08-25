"use client"

import React, { useEffect, useState } from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { motion } from 'framer-motion'

import { Users, UserCheck, CalendarCheck, Stethoscope, AlertCircle, TrendingUp, BarChart3, Calendar, Filter } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface StatResponse {
  users: number
  doctors: number
  appointments: number
  examined: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingRatioByMonth, setBookingRatioByMonth] = useState<any[]>([])
  const [revenueByDay, setRevenueByDay] = useState<any[]>([])
  const [revenueByYear, setRevenueByYear] = useState<any[]>([])
  const [specialtyData, setSpecialtyData] = useState<any[]>([])
  const [allSpecializations, setAllSpecializations] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedBookingYear, setSelectedBookingYear] = useState<string>('')
  const [pieStats, setPieStats] = useState<any>(null)

  // ===================================================================
  // FETCH DATA
  // ===================================================================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Vui lòng đăng nhập để xem thống kê')
          setLoading(false)
          return
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

        // Fetch stats
        const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        } else {
          const errorText = await statsRes.text();
          console.error('Lỗi fetch stats:', statsRes.status, errorText);
        }

        // Fetch booking ratio
        const bookingRes = await fetch(`${API_URL}/api/admin/booking-ratio-monthly`, { headers })
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json()
          setBookingRatioByMonth(Array.isArray(bookingData) ? bookingData : [])
        } else {
          const errorText = await bookingRes.text();
          console.error('Lỗi fetch booking ratio:', bookingRes.status, errorText);
        }

        // Fetch revenue daily
        const revenueDailyRes = await fetch(`${API_URL}/api/admin/revenue/daily`, { headers })
        if (revenueDailyRes.ok) {
          const revenueDailyData = await revenueDailyRes.json()
          setRevenueByDay(Array.isArray(revenueDailyData) ? revenueDailyData : [])
        } else {
          const errorText = await revenueDailyRes.text();
          console.error('Lỗi fetch revenue daily:', revenueDailyRes.status, errorText);
        }

        // Fetch revenue yearly
        const revenueYearlyRes = await fetch(`${API_URL}/api/admin/revenue/yearly`, { headers })
        if (revenueYearlyRes.ok) {
          const revenueYearlyData = await revenueYearlyRes.json()
          setRevenueByYear(Array.isArray(revenueYearlyData) ? revenueYearlyData : [])
        } else {
          const errorText = await revenueYearlyRes.text();
          console.error('Lỗi fetch revenue yearly:', revenueYearlyRes.status, errorText);
        }

        // Fetch pie stats
        const pieRes = await fetch(`${API_URL}/api/admin/pie-stats`, { headers })
        if (pieRes.ok) {
          const pieData = await pieRes.json()
          setPieStats(pieData)
        } else {
          const errorText = await pieRes.text();
          console.error('Lỗi fetch pie stats:', pieRes.status, errorText);
        }

        // Fetch specialty list
        const specialtyListRes = await fetch(`${API_URL}/api/admin/specialty-list`, { headers })
        if (specialtyListRes.ok) {
          const specialtyListData = await specialtyListRes.json()
          setAllSpecializations(Array.isArray(specialtyListData) ? specialtyListData.map((s: any) => s.name) : [])
        } else {
          const errorText = await specialtyListRes.text();
          console.error('Lỗi fetch specialty list:', specialtyListRes.status, errorText);
        }

        // Fetch specialty stats
        const specialtyStatsRes = await fetch(`${API_URL}/api/admin/specialty-stats`, { headers })
        if (specialtyStatsRes.ok) {
          const specialtyStatsData = await specialtyStatsRes.json()
          setSpecialtyData(Array.isArray(specialtyStatsData) ? specialtyStatsData : [])
        } else {
          const errorText = await specialtyStatsRes.text();
          console.error('Lỗi fetch specialty stats:', specialtyStatsRes.status, errorText);
        }

      } catch (err) {
        console.error('Lỗi fetch data:', err)
        setError('Có lỗi khi tải dữ liệu thống kê')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Đang tải dữ liệu</h2>
            <p className="text-slate-500">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Có lỗi xảy ra</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
          <AlertCircle className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-amber-600 mb-4">Không có dữ liệu</h2>
          <p className="text-slate-600">Không thể tải dữ liệu thống kê lúc này</p>
        </div>
      </div>
    )
  }

  // ===================================================================
  // CONFIGURATION DES CARTES DE STATISTIQUES
  // ===================================================================
  const statsConfig = [
    {
      label: 'Tổng người dùng',
      value: stats.users || 0,
      icon: Users,
      bgGradient: 'from-blue-500 to-blue-600',
      lightBg: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Bác sĩ hoạt động',
      value: stats.doctors || 0,
      icon: UserCheck,
      bgGradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-500'
    },
    {
      label: 'Lịch khám đã đặt',
      value: stats.appointments || 0,
      icon: CalendarCheck,
      bgGradient: 'from-purple-500 to-purple-600',
      lightBg: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-500'
    },
    {
      label: 'Bệnh nhân đã khám',
      value: stats.examined || 0,
      icon: Stethoscope,
      bgGradient: 'from-orange-500 to-orange-600',
      lightBg: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-500'
    }
  ]

  // ===================================================================
  // DỮ LIỆU BIỂU ĐỒ
  // ===================================================================

  // --- Booking ratio theo tháng (lọc theo năm) ---
  const filteredBookingRatio = selectedBookingYear
    ? (Array.isArray(bookingRatioByMonth) ? bookingRatioByMonth.filter(r => r.month.includes(`/${selectedBookingYear}`)) : [])
    : (Array.isArray(bookingRatioByMonth) ? bookingRatioByMonth : [])

  const monthLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  const ratioMap: Record<string, number> = {}
  filteredBookingRatio.forEach(r => {
    const [m] = r.month.split('/')
    ratioMap[`Tháng ${parseInt(m)}`] = parseFloat(r.ratio) * 100 || 0
  })

  const monthBookingRatioLineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Tỷ lệ đặt khám theo tháng (%)',
        data: monthLabels.map(m => ratioMap[m] || 0),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  // --- Doanh thu theo ngày ---
  const dayLineData = {
    labels: Array.isArray(revenueByDay) ? revenueByDay.map(r => r.day) : [],
    datasets: [
      {
        label: 'Doanh thu theo ngày (VNĐ)',
        data: Array.isArray(revenueByDay) ? revenueByDay.map(r => parseInt(r.total) || 0) : [],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }

  // --- Doanh thu theo năm ---
  const yearBarData = {
    labels: Array.isArray(revenueByYear) ? revenueByYear.map(r => r.year) : [],
    datasets: [
      {
        label: 'Doanh thu theo năm (VNĐ)',
        data: Array.isArray(revenueByYear) ? revenueByYear.map(r => parseInt(r.total) || 0) : [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  // --- Chuyên khoa ---
  const getColorPalette = (count: number): string[] => {
    const baseColors = [
      'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 
      'rgba(239, 68, 68, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(20, 184, 166, 0.8)',
      'rgba(234, 179, 8, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(14, 165, 233, 0.8)', 
      'rgba(244, 63, 94, 0.8)'
    ]
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length])
  }

  const filteredSpecialtyData = specialtyData.filter(item => {
    const date = new Date(item.day)
    const monthMatch = selectedMonth ? date.getMonth() + 1 === parseInt(selectedMonth) : true
    const yearMatch = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true
    return monthMatch && yearMatch
  })

  const specialtyBarData = {
    labels: allSpecializations,
    datasets: [
      {
        label: 'Số lượt đặt khám',
        data: allSpecializations.map(spec => {
          return filteredSpecialtyData
            .filter(item => item.specialization === spec)
            .reduce((sum, cur) => sum + cur.total_appointments, 0)
        }),
        backgroundColor: getColorPalette(allSpecializations.length),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  // --- Pie charts với màu sắc cải tiến ---
  const statusChartData = {
    labels: Array.isArray(pieStats?.statusStats) ? pieStats.statusStats.map((s: any) => s.status) : [],
    datasets: [
      {
        label: 'Trạng thái lịch khám',
        data: Array.isArray(pieStats?.statusStats) ? pieStats.statusStats.map((s: any) => s.count) : [],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    ]
  }

  const genderChartData = {
    labels: Array.isArray(pieStats?.genderStats) ? pieStats.genderStats.map((g: any) => g.gender || 'Khác') : [],
    datasets: [
      {
        label: 'Tỷ lệ giới tính',
        data: Array.isArray(pieStats?.genderStats) ? pieStats.genderStats.map((g: any) => g.count) : [],
        backgroundColor: ['#3b82f6', '#ec4899', '#a855f7'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    ]
  }

  const verifiedChartData = {
    labels: ['Đã xác minh', 'Chưa xác minh'],
    datasets: [
      {
        label: 'Tài khoản xác minh',
        data: [pieStats?.verified || 0, pieStats?.unverified || 0],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    ]
  }

  const examinedChartData = {
    labels: ['Đã khám', 'Chưa khám'],
    datasets: [
      {
        label: 'Tình trạng khám bệnh',
        data: [pieStats?.examined || 0, pieStats?.not_examined || 0],
        backgroundColor: ['#06b6d4', '#ef4444'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    ]
  }

  // ===================================================================
  // OPTIONS CHUNG CHO CHART
  // ===================================================================
  const chartBaseOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  const barChartOptions = {
    ...chartBaseOptions,
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    },
    plugins: {
      legend: { 
        display: false 
      }
    }
  }

  const lineChartOptions = {
    ...chartBaseOptions,
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#374151'
        }
      }
    }
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          color: '#374151'
        }
      }
    }
  }

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-200/20 to-blue-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl"></div>
      </div>

      <div className="relative p-6 space-y-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
              📊 Dashboard Quản Trị
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Tổng quan thống kê và phân tích dữ liệu hệ thống y tế
            </p>
          </motion.div>

          {/* Top stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statsConfig.map(({ label, value, icon: Icon, bgGradient, lightBg, textColor, borderColor, iconColor }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
              >
                <Card className={`group relative overflow-hidden bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${borderColor} hover:border-opacity-50`}>
                  {/* Gradient background overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${lightBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                  
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <TrendingUp className={`w-5 h-5 ${iconColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                        {label}
                      </p>
                      <p className={`text-3xl font-bold ${textColor} group-hover:scale-105 transition-transform duration-300`}>
                        {value?.toLocaleString() || 0}
                      </p>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${bgGradient} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-200`}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Pie charts */}
          {pieStats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Phân Tích Tổng Quan</h2>
                <p className="text-slate-600">Thống kê phân bố theo các danh mục</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { data: statusChartData, title: "Trạng thái lịch khám", icon: CalendarCheck },
                  { data: examinedChartData, title: "Tình trạng khám bệnh", icon: Stethoscope },
                  { data: genderChartData, title: "Phân bố giới tính", icon: Users },
                  { data: verifiedChartData, title: "Xác minh tài khoản", icon: UserCheck }
                ].map((chart, idx) => (
                  <Card key={idx} className="bg-white/80 backdrop-blur-sm shadow-xl border border-slate-200 rounded-2xl hover:shadow-2xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <chart.icon className="w-6 h-6 text-slate-600 mr-2" />
                        <h3 className="font-semibold text-slate-700 text-sm text-center">{chart.title}</h3>
                      </div>
                      <div className="h-48">
                        <Doughnut data={chart.data} options={pieChartOptions} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Charts section header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Biểu Đồ Phân Tích Chi Tiết</h2>
            <p className="text-slate-600 text-lg">Theo dõi xu hướng và dữ liệu theo thời gian</p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="month" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200 p-1 rounded-2xl shadow-lg">
                <TabsTrigger 
                  value="month" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 rounded-xl font-medium text-slate-700 hover:text-blue-600 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Theo tháng
                </TabsTrigger>
               
              </TabsList>
            </div>

            {/* Month Tab */}
            <TabsContent value="month">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Tỷ lệ đặt khám theo tháng</h3>
                        <p className="text-slate-600">Phân tích xu hướng đặt lịch khám trong năm</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-slate-500" />
                        <label className="text-sm font-medium text-slate-700">Chọn năm:</label>
                        <select
                          className="bg-white border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 outline-none min-w-[120px]"
                          value={selectedBookingYear}
                          onChange={e => setSelectedBookingYear(e.target.value)}
                        >
                          <option value="">Tất cả năm</option>
                          {Array.isArray(bookingRatioByMonth) ? Array.from(new Set(bookingRatioByMonth.map(r => r.month.split('/')[1]))).map(year => (
                            <option key={year} value={year}>{year}</option>
                          )) : []}
                        </select>
                      </div>
                    </div>
                    <div className="h-[400px] w-full">
                      <Line data={monthBookingRatioLineData} options={lineChartOptions} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Day Tab */}
            <TabsContent value="day">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Doanh thu theo ngày</h3>
                      <p className="text-slate-600">Theo dõi doanh thu hàng ngày của hệ thống</p>
                    </div>
                    <div className="h-[400px] w-full">
                      <Line data={dayLineData} options={lineChartOptions} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Year Tab */}
            <TabsContent value="year">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Doanh thu theo năm</h3>
                      <p className="text-slate-600">Tổng quan doanh thu qua các năm hoạt động</p>
                    </div>
                    <div className="h-[400px] w-full">
                      <Bar data={yearBarData} options={barChartOptions} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Specialty section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Thống Kê Theo Chuyên Khoa</h2>
              <p className="text-slate-600 text-lg">Phân tích số lượt đặt khám theo từng chuyên khoa y tế</p>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Biểu đồ chuyên khoa</h3>
                    <p className="text-slate-600">Số lượt đặt khám theo từng chuyên khoa</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-slate-500" />
                      <label className="text-sm font-medium text-slate-700">Tháng:</label>
                      <select
                        className="bg-white border-2 border-slate-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 outline-none min-w-[130px]"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                      >
                        <option value="">Tất cả tháng</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={i + 1}>{`Tháng ${i + 1}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-slate-700">Năm:</label>
                      <select
                        className="bg-white border-2 border-slate-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 outline-none min-w-[120px]"
                        value={selectedYear}
                        onChange={e => setSelectedYear(e.target.value)}
                      >
                        <option value="">Tất cả năm</option>
                        {Array.isArray(specialtyData) ? Array.from(new Set(specialtyData.map(item => new Date(item.day).getFullYear()))).map(year => (
                          <option key={year} value={year}>{year}</option>
                        )) : []}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="h-[500px] w-full overflow-auto">
                  <Bar data={specialtyBarData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer decorative section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center py-16 mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <h3 className="text-2xl font-bold mb-2">Dashboard Quản Trị Y Tế</h3>
              <p className="text-slate-600 text-sm">Được thiết kế với ❤️ để quản lý hiệu quả</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}