"use client";

import {
  StatsCard,
  RecentOrders,
  RevenueChart,
  TopProducts,
  CustomerReviews,
} from "@/components/dashboard";
import { ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your store performance overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$45,231.89"
          change={20.1}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Orders"
          value="1,234"
          change={15.3}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Customers"
          value="5,234"
          change={10.5}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Growth Rate"
          value="+12.5%"
          change={5.2}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <CustomerReviews />
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
