"use client";

import {
  StatsCard,
  RecentOrders,
  RevenueChart,
  TopProducts,
} from "@/components/dashboard";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "@/lib/redux/api/admin.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: statsData, isLoading, error } = useGetDashboardStatsQuery();
  const stats = statsData?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your store performance overview.
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
          change={stats?.revenueChange || 0}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || "0"}
          change={stats?.ordersChange || 0}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers?.toLocaleString() || "0"}
          change={stats?.customersChange || 0}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          icon={<Package className="h-4 w-4" />}
        />
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats?.pendingOrders || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processing
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.processingOrders || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Shipped
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.shippedOrders || 0}
                </p>
              </div>
              <Truck className="h-8 w-8 text-purple-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.deliveredOrders || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.cancelledOrders || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <TopProducts />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}
