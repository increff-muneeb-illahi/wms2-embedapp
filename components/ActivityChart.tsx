"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fetchActivityReport } from "@/lib/api";
import { ActivityReportParams } from "@/types/audit";

interface ActivityChartProps {
  tenant: string;
  table: string;
  actor?: string;
  timestampFrom?: string; 
  timestampTo?: string;
}

interface ActivityDataItem {
  date: string;
  dateLabel: string;
  dateTimeLabel: string;
  eventCount: number;
}

export function ActivityChart({ tenant, table, actor }: ActivityChartProps) {
  const [activityData, setActivityData] = useState<ActivityDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadActivityData() {
      try {
        setLoading(true);
        setError(null);

        // Get dates for the last 7 days
        const dates: Date[] = [];
        for (let i = 20; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          dates.push(date);
        }

        // Fetch data for each day
        const activityDataPromises = dates.map(async (date) => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);

          const params: ActivityReportParams = {
            tenant,
            table,
            actor,
            timestampFrom: date.toISOString(),
            timestampTo: nextDay.toISOString(),
            limit: 1000, // Get all records for the day
          };

          const reportData = await fetchActivityReport(params);
          
          // Sum up all eventCounts for this day
          const totalCount = reportData.reduce((sum, item) => sum + (item.eventCount || 0), 0);

          const dayLabel = date.toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric" 
          });
          const timeLabel = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          const dateTimeLabel = `${dayLabel} ${timeLabel}`;

          return {
            date: date.toISOString(),
            dateLabel: dayLabel,
            dateTimeLabel: dateTimeLabel,
            eventCount: totalCount, 
          };
        });

        const results = await Promise.all(activityDataPromises);
        setActivityData(results);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        let errorMessage = "An unknown error occurred";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String(err.message);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (tenant && table) {
      loadActivityData();
    }
  }, [tenant, table, actor]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading activity data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Error Loading Activity Data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Format data for recharts
  const chartData = activityData.map((activity) => ({
    date: activity.dateTimeLabel,
    eventCount: activity.eventCount,
  }));

  const maxCount = Math.max(...activityData.map(activity => activity.eventCount), 1);
  const yAxisDomain = [0, Math.max(maxCount * 1.1, 10)]; // Add 10% padding, minimum 10

  // Calculate Y-axis ticks
  const tickCount = 5;
  const tickStep = Math.ceil(maxCount / (tickCount - 1));
  const yAxisTicks = Array.from({ length: tickCount }, (_, i) => i * tickStep);

  return (
    <div className="w-screen h-screen">
        {activityData.every(activity => activity.eventCount === 0) ? (
        <div className="w-screen h-screen flex items-center justify-center text-gray-500">
          No activity found in the last 7 days
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={false}
              tickLine={{ stroke: "#6b7280", strokeWidth: 1 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              label={{ value: "actions performed", angle: -90, position: "insideLeft", fill: "#6b7280" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={yAxisDomain}
              ticks={yAxisTicks}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#374151", fontWeight: 600 }}
            />
            <Bar
              dataKey="eventCount"
              fill="#ef4444"
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

