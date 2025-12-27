"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 4780 },
  { month: "May", revenue: 1390 },
  { month: "Jun", revenue: 2390 },
  { month: "Jul", revenue: 3490 },
];

export function RevenueChart() {
  const maxValue = 5000;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
        <p className="text-sm text-muted-foreground">Jan 1 - Dec 31, 2025</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10">
                  {data.month}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                    style={{
                      width: `${(data.revenue / maxValue) * 100}%`,
                    }}
                  >
                    {(data.revenue / maxValue) * 100 > 15 && (
                      <span className="text-xs font-semibold text-white">
                        ${data.revenue / 1000}K
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">
                  ${data.revenue / 1000}K
                </span>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Total Revenue
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${chartData.reduce((sum, item) => sum + item.revenue, 0) / 1000}
                K
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Average
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                $
                {(
                  chartData.reduce((sum, item) => sum + item.revenue, 0) /
                  chartData.length /
                  1000
                ).toFixed(1)}
                K
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Peak
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${Math.max(...chartData.map((item) => item.revenue)) / 1000}K
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
