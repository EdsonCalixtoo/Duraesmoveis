'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface SalesDataPoint {
  day: string;
  sales: number;
}

export default function SalesBarChart({ data }: { data: SalesDataPoint[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#222222' }}
          />
          <YAxis
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#222222' }}
            tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ fill: 'rgba(140, 240, 0, 0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#1C1C1C] border border-[#303030] rounded-xl p-3 shadow-2xl text-xs">
                    <span className="text-[#A3A3A3] block">Dia {payload[0].payload.day}</span>
                    <span className="text-white font-extrabold text-sm text-[#8CF000]">
                      {formatCurrency(payload[0].value as number)}
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="sales"
            fill="#8CF000"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
