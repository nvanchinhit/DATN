"use client"

import React, { useEffect, useState } from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { motion } from 'framer-motion'

import { Users, UserCheck, CalendarCheck, Stethoscope } from 'lucide-react'

interface StatResponse {
  users: number
  doctors: number
  appointments: number
  examined: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatResponse | null>(null)
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
    fetch('/api/admin/stats').then(res => res.json()).then(setStats)
    fetch('/api/admin/booking-ratio-monthly').then(res => res.json()).then(setBookingRatioByMonth)
    fetch('/api/admin/revenue-daily').then(res => res.json()).then(setRevenueByDay)
    fetch('/api/admin/revenue-yearly').then(res => res.json()).then(setRevenueByYear)
    fetch('/api/admin/pie-stats').then(res => res.json()).then(setPieStats)

    fetch('/api/admin/specialty-list')
      .then(res => res.json())
      .then(data => setAllSpecializations(data.map((s: any) => s.name)))
      .catch(() => setAllSpecializations([]))

    fetch('/api/admin/specialty-stats')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].specialization) {
          setSpecialtyData(data)
        } else {
          console.warn("⚠️ specialty-stats trả dữ liệu không hợp lệ:", data)
          setSpecialtyData([])
        }
      })
  }, [])

  if (!stats) return <div className="p-4 text-center">Đang tải thống kê...</div>

  // ===================================================================
  // CONFIGURATION DES CARTES DE STATISTIQUES
  // ===================================================================
  const statsConfig = [
    {
      label: 'Người dùng',
      value: stats.users,
      icon: Users,
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Bác sĩ',
      value: stats.doctors,
      icon: UserCheck,
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'Lượt đặt khám',
      value: stats.appointments,
      icon: CalendarCheck,
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Đã khám',
      value: stats.examined,
      icon: Stethoscope,
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ]

  // ===================================================================
  // DỮ LIỆU BIỂU ĐỒ
  // ===================================================================

  // --- Booking ratio theo tháng (lọc theo năm) ---
  const filteredBookingRatio = selectedBookingYear
    ? bookingRatioByMonth.filter(r => r.month.includes(`/${selectedBookingYear}`))
    : bookingRatioByMonth

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
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // --- Doanh thu theo ngày ---
  const dayLineData = {
    labels: revenueByDay.map(r => r.day),
    datasets: [
      {
        label: 'Doanh thu theo ngày',
        data: revenueByDay.map(r => parseInt(r.total) || 0),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // --- Doanh thu theo năm ---
  const yearBarData = {
    labels: revenueByYear.map(r => r.year),
    datasets: [
      {
        label: 'Doanh thu theo năm (VNĐ)',
        data: revenueByYear.map(r => parseInt(r.total) || 0),
        backgroundColor: '#10b981',
      },
    ],
  }

  // --- Chuyên khoa ---
  const getColorPalette = (count: number): string[] => {
    const baseColors = [
      '#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6',
      '#14b8a6', '#eab308', '#ec4899', '#0ea5e9', '#f43f5e'
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
        label: 'Tổng số lượt đặt khám theo chuyên khoa',
        data: allSpecializations.map(spec => {
          return filteredSpecialtyData
            .filter(item => item.specialization === spec)
            .reduce((sum, cur) => sum + cur.total_appointments, 0)
        }),
        backgroundColor: getColorPalette(allSpecializations.length),
        borderRadius: 6,
        barThickness: 30,
        hoverBackgroundColor: '#6366f1'
      },
    ],
  }

  // --- Pie charts ---
  const statusChartData = {
    labels: pieStats?.statusStats.map((s: any) => s.status) || [],
    datasets: [
      {
        label: 'Trạng thái lịch khám',
        data: pieStats?.statusStats.map((s: any) => s.count) || [],
        backgroundColor: ['#3b82f6', '#f97316', '#10b981', '#f43f5e']
      }
    ]
  }

  const genderChartData = {
    labels: pieStats?.genderStats.map((g: any) => g.gender || 'Khác') || [],
    datasets: [
      {
        label: 'Tỷ lệ giới tính',
        data: pieStats?.genderStats.map((g: any) => g.count) || [],
        backgroundColor: ['#3b82f6', '#f43f5e', '#a855f7']
      }
    ]
  }

  const verifiedChartData = {
    labels: ['Đã xác minh', 'Chưa xác minh'],
    datasets: [
      {
        label: 'Tài khoản xác minh',
        data: [pieStats?.verified || 0, pieStats?.unverified || 0],
        backgroundColor: ['#10b981', '#f59e0b']
      }
    ]
  }

  const examinedChartData = {
    labels: ['Đã khám', 'Chưa khám'],
    datasets: [
      {
        label: 'Tình trạng khám bệnh',
        data: [pieStats?.examined || 0, pieStats?.not_examined || 0],
        backgroundColor: ['#06b6d4', '#f43f5e']
      }
    ]
  }

  // ===================================================================
  // OPTIONS CHUNG CHO CHART FULL WIDTH / FULL HEIGHT
  // ===================================================================
  const chartBaseOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  const barChartOptions: any = {
    ...chartBaseOptions,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const lineChartOptions = {
    ...chartBaseOptions,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    scales: {
      y: { beginAtZero: true }
    }
  }

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📊 Thống kê & Báo cáo</h1>

        {/* Top stats - Version améliorée */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsConfig.map(({ label, value, icon: Icon, bgGradient, iconBg, textColor, borderColor }) => (
            <Card 
              key={label} 
              className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-2 ${borderColor}`}
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              
              {/* Fond dégradé */}
              <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50`}></div>
              
              <CardContent className="relative p-4 text-center">
                {/* Icône avec animation */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${iconBg} mb-3 transform group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                
                {/* Label */}
                <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  {label}
                </p>
                
                {/* Valeur avec animation */}
                <p className={`text-2xl font-bold ${textColor} group-hover:scale-110 transition-transform duration-300`}>
                  {value?.toLocaleString() || 0}
                </p>
                
                {/* Barre de progression décorative */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${iconBg} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200`}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Pie charts */}
        {pieStats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            {[statusChartData, examinedChartData, genderChartData, verifiedChartData].map((chart, idx) => (
              <Card key={idx} className="bg-white shadow-lg border border-gray-200 rounded-xl hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4">
                  <Doughnut data={chart} options={{ responsive: true, maintainAspectRatio: false }} />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Titre pour les graphiques */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Biểu đồ thống kê chi tiết</h2>
          <p className="text-gray-600">Phân tích dữ liệu theo thời gian và chuyên khoa</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="month" className="space-y-6">
          

          {/* Month (Line) */}
          <TabsContent value="month">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Biểu đồ số lượt đặt khám trong năm</h2>
                <label className="mr-2 text-sm text-gray-600">Chọn năm:</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedBookingYear}
                  onChange={e => setSelectedBookingYear(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {[...new Set(bookingRatioByMonth.map(r => r.month.split('/')[1]))].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
                <CardContent className="p-4 h-[400px] w-full">
                  <div className="relative h-full w-full">
                    <Line data={monthBookingRatioLineData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Day (Line) */}
          <TabsContent value="day">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
                <CardContent className="p-4 h-[400px] w-full">
                  <div className="relative h-full w-full">
                    <Line data={dayLineData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Year (Bar) */}
          <TabsContent value="year">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
                <CardContent className="p-4 h-[400px] w-full">
                  <div className="relative h-full w-full">
                    <Bar data={yearBarData} options={barChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Titre pour le graphique des spécialités */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thống kê theo chuyên khoa</h2>
          <p className="text-gray-600">Phân tích số lượt đặt khám theo từng chuyên khoa y tế</p>
        </div>

        {/* Specialty Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
            <CardContent className="p-4 h-[490px] w-full overflow-auto">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Biểu đồ số lượt đặt khám theo từng chuyên khoa</h2>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  <option value="">Tất cả tháng</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>{`Tháng ${i + 1}`}</option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  <option value="">Tất cả năm</option>
                  {Array.from(new Set(specialtyData.map(item => new Date(item.day).getFullYear()))).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="relative h-[400px] w-full">
                <Bar data={specialtyBarData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Éléments décoratifs de fond */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-10 animate-pulse pointer-events-none"></div>
        <div className="fixed bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-10 animate-pulse delay-1000 pointer-events-none"></div>
        <div className="fixed top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-10 animate-pulse delay-500 pointer-events-none"></div>
      </div>
    </div>
  )
}