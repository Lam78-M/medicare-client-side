"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const BASE_COLORS = [
  "#10B981", "#3B82F6", "#F97316", "#8B5CF6", "#EF4444", "#F59E0B",
  "#EC4899", "#14B8A6", "#6366F1", "#06B6D4", "#84CC16", "#A855F7",
  "#F43F5E", "#0EA5E9", "#64748B", "#D946EF", "#059669", "#B45309",
  "#4338CA", "#BE185D", "#0369A1", "#4D7C0F", "#701A75", "#1E293B",
  "#16A34A", "#2563EB", "#EA580C", "#9333EA", "#DC2626", "#D97706"
];

export default function Recharts2() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/appointments`);
        const data = await res.json();

        const appointments = Array.isArray(data) ? data : [];
        const count = {};

        appointments.forEach((app) => {
          const specialty = app.specialization || "General / Unknown";
          count[specialty] = (count[specialty] || 0) + 1;
        });

        const formatted = Object.keys(count)
          .map((key, index) => ({
            name: key,
            value: count[key],
            fill: BASE_COLORS[index % BASE_COLORS.length]  
          }))
          .sort((a, b) => b.value - a.value);

        setChartData(formatted);
      } catch (err) {
        console.error("Error building chart from appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[450px] text-lg font-bold text-[#021A54]">
        Loading Appointment Insights... ⏳
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
        <span className="text-4xl block mb-2">📅</span>
        <h3 className="text-lg font-bold text-[#021A54]">No Appointments Found</h3>
        <p className="text-xs text-gray-400 mt-1">
          Make sure your appointments collection has data.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#021A54]">
          📊 Appointment Specialty Breakdown
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Distribution across {chartData.length} active clinical fields.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

  
        <div className="lg:col-span-5 relative h-[380px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
        
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={95}
                outerRadius={145}
                paddingAngle={chartData.length > 15 ? 1 : 3}
                cornerRadius={10}
                stroke="#fff"
                strokeWidth={4}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,.12)",
                }}
                itemStyle={{ color: "#021A54", fontWeight: "bold" }}
                formatter={(value, name) => [`${value} Bookings`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Analytics Info */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              Total Booked
            </p>
            <h2 className="text-4xl font-extrabold text-[#021A54] my-0.5">
              {chartData.reduce((sum, item) => sum + item.value, 0)}
            </h2>
            <p className="text-gray-500 text-xs font-medium">
              Appointments
            </p>
          </div>
        </div>

        {/* 📋 Custom Horizontally Balanced Legend (7 Columns) */}
        <div className="lg:col-span-7 w-full">
          <h3 className="font-bold text-sm text-[#021A54] mb-3 uppercase tracking-wider px-1">
            Demanded Fields
          </h3>

          <div className="max-h-[340px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 scrollbar-thin scrollbar-thumb-gray-200">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50/60 border border-gray-100 rounded-xl p-3 hover:bg-gray-100/80 transition min-w-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
       
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{
                      backgroundColor: item.fill, 
                    }}
                  />
         
                  <span className="font-bold text-xs text-gray-700 truncate">
                    {item.name}
                  </span>
                </div>
    
                <span className="font-black text-xs text-[#021A54] bg-white px-2 py-0.5 rounded-md border border-gray-100 shrink-0 shadow-3xs">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}