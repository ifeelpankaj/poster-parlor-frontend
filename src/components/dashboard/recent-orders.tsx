"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useGetRecentOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/redux/api/admin.api";
import { OrderStatus } from "@/lib/redux/api/order.api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    label: "Pending",
  },
  PROCESSING: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    label: "Processing",
  },
  SHIPPED: {
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    label: "Shipped",
  },
  DELIVERED: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    label: "Delivered",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    label: "Cancelled",
  },
};

export function RecentOrders() {
  const { data, isLoading, error } = useGetRecentOrdersQuery(10);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = data?.data || [];

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus({ orderId, status }).unwrap();
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Failed to load orders
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No orders yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium font-mono text-xs">
                    #{order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.customer?.name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer?.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell className="font-medium">
                    ₹{order.totalPrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[order.status]?.color || ""}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/dashboard/orders?view=${order._id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {order.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order._id, "PROCESSING")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                        )}
                        {order.status === "PROCESSING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order._id, "SHIPPED")
                            }
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Shipped
                          </DropdownMenuItem>
                        )}
                        {order.status === "SHIPPED" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order._id, "DELIVERED")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </DropdownMenuItem>
                        )}
                        {(order.status === "PENDING" ||
                          order.status === "PROCESSING") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order._id, "CANCELLED")
                              }
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
