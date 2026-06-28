"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#10B981", // Cardiology
  "#3B82F6", // Neurology
  "#F97316", // Orthopedics
  "#8B5CF6", // Pediatrics
  "#EF4444", // Dermatology
  "#F59E0B", // Ophthalmology
];

export default function Recharts2() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        const doctors = Array.isArray(data) ? data : data.result || [];

        const count = {};

        doctors.forEach((doctor) => {
          const specialty = doctor.specialization || "Unknown";
          count[specialty] = (count[specialty] || 0) + 1;
        });

        const formatted = Object.keys(count).map((key, index) => ({
          name: key,
          value: count[key],
          color: COLORS[index % COLORS.length],
        }));

        setChartData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Ecosystem Specialty Breakdown
        </h2>

        <div className="h-[500px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={95}
                outerRadius={145}
                dataKey="value"
                paddingAngle={6}
                cornerRadius={18}
                stroke="#fff"
                strokeWidth={6}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`${value} Doctors`, "Total"]}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="square"
                wrapperStyle={{
                  fontSize: "15px",
                  paddingTop: "25px",
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}