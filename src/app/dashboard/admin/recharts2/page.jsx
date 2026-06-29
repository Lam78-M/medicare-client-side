"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const BASE_COLORS = [
  "#10B981",
  "#3B82F6",
  "#F97316",
  "#8B5CF6",
  "#EF4444",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#06B6D4",
  "#84CC16",
  "#A855F7",
  "#F43F5E",
  "#0EA5E9",
  "#64748B",
  "#D946EF",
  "#059669",
  "#B45309",
  "#4338CA",
  "#BE185D",
  "#0369A1",
  "#4D7C0F",
  "#701A75",
  "#1E293B",
  "#16A34A",
  "#2563EB",
  "#EA580C",
  "#9333EA",
  "#DC2626",
  "#D97706",
  "#CA8A04",
  "#65A30D",
  "#0D9488",
  "#4F46E5",
];

export default function Recharts2() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");

        const data = await res.json();

        console.log("API Response:", data);

        const doctors = Array.isArray(data)
          ? data
          : data.result || data.data || [];

        const count = {};

        doctors.forEach((doctor) => {
          const specialty = doctor.specialization || "Unknown";
          count[specialty] = (count[specialty] || 0) + 1;
        });

        const formatted = Object.keys(count)
          .map((key) => ({
            name: key,
            value: count[key],
          }))
          .sort((a, b) => b.value - a.value);

        console.log(formatted);

        setChartData(formatted);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px] text-xl font-bold">
        Loading...
      </div>
    );
  }  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#021A54]">
          📊 Ecosystem Specialty Breakdown
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Specializations: {chartData.length}
        </p>
      </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-8 items-start">

        {/* Chart */}
       <div className="relative h-[280px] sm:h-[340px] md:h-[400px] lg:h-[420px]">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={150}
                paddingAngle={3}
                cornerRadius={8}
                stroke="#fff"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={BASE_COLORS[index % BASE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,.15)",
                }}
                formatter={(value, name) => [
                  `${value} Doctors`,
                  name,
                ]}
              />

            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
        

        </div>

        {/* Custom Legend */}

        <div className="mt-7">

          <h3 className="font-bold text-lg text-[#021A54] mb-8 ">
            Medical Specialties
          </h3>

   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 max-h-[320px] sm:max-h-[420px] overflow-y-auto pr-1">

            {chartData.map((item, index) => (

             <div
  key={index}
  className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border hover:shadow-md transition"
>

                <div className="flex items-center gap-3">

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        BASE_COLORS[index % BASE_COLORS.length],
                    }}
                  />

                  <span className="font-medium text-gray-700">
                    {item.name}
                  </span>

                </div>

                <span className="font-bold text-[#021A54]">
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