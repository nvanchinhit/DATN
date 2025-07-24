"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function StatisticsPage() {
  const [overview, setOverview] = useState<any>({});
  const [doctorRevenue, setDoctorRevenue] = useState([]);
  const [userRevenue, setUserRevenue] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [overviewRes, doctorRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/statistics/overview"),
          axios.get("http://localhost:5000/statistics/revenue-by-doctor"),
          axios.get("http://localhost:5000/statistics/revenue-by-user"),
        ]);
        setOverview(overviewRes.data);
        setDoctorRevenue(doctorRes.data);
        setUserRevenue(userRes.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu thống kê:", err);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-blue-700">Thống kê tổng quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Tổng khách hàng</h2>
            <p className="text-2xl font-bold text-green-700">{overview.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Tổng bác sĩ</h2>
            <p className="text-2xl font-bold text-blue-700">{overview.totalDoctors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Tổng lịch hẹn</h2>
            <p className="text-2xl font-bold text-orange-700">{overview.totalAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Tổng doanh thu</h2>
            <p className="text-2xl font-bold text-red-700">{overview.totalRevenue?.toLocaleString("vi-VN")}₫</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Doanh thu theo bác sĩ</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorRevenue}>
                <XAxis dataKey="doctor_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Doanh thu theo khách hàng</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRevenue}
                  dataKey="revenue"
                  nameKey="user_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {userRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
