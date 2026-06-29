"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import Recharts2 from "../recharts2/page";
import Recharts3 from "../recharts3/page";

export default function ReviewsChart() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const chartData = reviews.map((review) => ({
    name: review.patientName,
    rating: review.rating,
  }));

  const colors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md border p-6">
      <h2 className="text-xl font-bold mb-6">
        Clinician Performance Index (Ratings)
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
          />

          <Tooltip />

          <Bar
            dataKey="rating"
            radius={[6, 6, 0, 0]}
          >
            {chartData.map((item, index) => (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Review Rating</span>
        </div>
      </div>
      
    </div>
    <br></br>
    <Recharts2></Recharts2>
    <br></br>
    <Recharts3 ></Recharts3>
    </div>

  );
}