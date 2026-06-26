"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function DoctorDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/pending-doctors"
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setDoctors(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const totalDoctors = doctors.length;

  const verifiedDoctors = doctors.filter(
    (doctor) =>
      doctor.verificationStatus?.toLowerCase() === "verified"
  ).length;

  const pendingDoctors = doctors.filter(
    (doctor) =>
      doctor.verificationStatus?.toLowerCase() !== "verified"
  ).length;

  const chartData = [
    {
      name: "Total",
      count: totalDoctors,
    },
    {
      name: "Verified",
      count: verifiedDoctors,
    },
    {
      name: "Pending",
      count: pendingDoctors,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-[#021A54] mb-8">
          Doctor Analytics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h3 className="text-gray-500 font-medium">
              Total Doctors
            </h3>
            <p className="text-4xl font-bold text-[#021A54] mt-2">
              {totalDoctors}
            </p>
          </div>

          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h3 className="text-gray-500 font-medium">
              Verified Doctors
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {verifiedDoctors}
            </p>
          </div>

          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h3 className="text-gray-500 font-medium">
              Pending Doctors
            </h3>
            <p className="text-4xl font-bold text-orange-500 mt-2">
              {pendingDoctors}
            </p>
          </div>

        </div>

        {/* Chart Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 h-[500px]">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Doctor Verification Statistics
          </h2>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                name="Doctor Count"
              />
            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}