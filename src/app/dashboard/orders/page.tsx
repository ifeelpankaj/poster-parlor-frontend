"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/lib/redux/api/admin.api";
import {
  OrderStatus,
  OrderResponse,
  PopulatedPoster,
} from "@/lib/redux/api/order.api";
import { toast } from "sonner";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

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

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewOrderId = searchParams.get("view");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    viewOrderId
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(!!viewOrderId);
  const [trackingNumber, setTrackingNumber] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open modal if view param exists
  useEffect(() => {
    if (viewOrderId) {
      setSelectedOrderId(viewOrderId);
      setIsDetailsOpen(true);
    }
  }, [viewOrderId]);

  const { data, isLoading, error, refetch, isFetching } =
    useGetAdminOrdersQuery({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: debouncedSearch || undefined,
    });

  const { data: orderDetails, isLoading: isLoadingDetails } =
    useGetAdminOrderByIdQuery(selectedOrderId || "", {
      skip: !selectedOrderId,
    });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const order = orderDetails?.data;

  const handleStatusUpdate = async (
    orderId: string,
    status: OrderStatus,
    tracking?: string
  ) => {
    try {
      await updateStatus({
        orderId,
        status,
        trackingNumber: tracking,
      }).unwrap();
      toast.success(`Order status updated to ${statusConfig[status].label}`);
      if (status === "SHIPPED") {
        setTrackingNumber("");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder({ orderId, reason: "Cancelled by admin" }).unwrap();
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const openOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsOpen(true);
    router.push(`/dashboard/orders?view=${orderId}`, { scroll: false });
  };

  const closeOrderDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrderId(null);
    router.push("/dashboard/orders", { scroll: false });
  };

  const getItemImage = (item: OrderResponse["items"][0]) => {
    const poster = item.posterId as PopulatedPoster;
    return poster?.images?.[0]?.url || null;
  };

  const getItemTitle = (item: OrderResponse["items"][0]) => {
    const poster = item.posterId as PopulatedPoster;
    return poster?.title || "Product";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Failed to load orders</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all customer orders
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as OrderStatus | "all");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Orders {pagination && `(${pagination.totalOrders})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
              {(debouncedSearch || statusFilter !== "all") && (
                <p className="text-sm mt-2">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs font-medium">
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
                      <TableCell className="font-semibold">
                        ₹{order.totalPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.isPaid ? "default" : "secondary"}>
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[order.status]?.color}>
                          {statusConfig[order.status]?.label}
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
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openOrderDetails(order._id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
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
                                onClick={() => openOrderDetails(order._id)}
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Ship Order
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
                                  onClick={() => handleCancelOrder(order._id)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={pageNum === currentPage}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNum}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => !open && closeOrderDetails()}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <DialogHeader>
                <DialogTitle>Loading Order Details</DialogTitle>
              </DialogHeader>
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : order ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Order #{order._id.slice(-8).toUpperCase()}
                  <Badge className={statusConfig[order.status]?.color}>
                    {statusConfig[order.status]?.label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Customer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {order.customer?.name}
                        </span>
                      </div>
                      {order.customer?.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {order.customer.email}
                        </div>
                      )}
                      {order.customer?.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {order.customer.phone}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                          <p>{order.shippingAddress.addressLine1}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}
                          </p>
                          <p>{order.shippingAddress.pincode}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Order Items ({order.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                            {getItemImage(item) ? (
                              <Image
                                src={getItemImage(item)!}
                                alt={getItemTitle(item)}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {getItemTitle(item)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                          <div className="font-semibold">
                            ₹{(item.quantity * item.price).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>
                          ₹
                          {(
                            order.totalPrice -
                            order.shippingCost -
                            order.taxAmount
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹{order.shippingCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (GST)</span>
                        <span>₹{order.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-semibold text-base">
                        <span>Total</span>
                        <span>₹{order.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">
                          Payment Method
                        </span>
                        <Badge variant={order.isPaid ? "default" : "secondary"}>
                          {order.paymentDetails.method} -{" "}
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between pt-2">
                          <span className="text-muted-foreground">
                            Tracking Number
                          </span>
                          <span className="font-mono">
                            {order.trackingNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Ship Order Form */}
                {order.status === "PROCESSING" && (
                  <Card className="border-primary/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Ship Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="Enter tracking number (optional)"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            order._id,
                            "SHIPPED",
                            trackingNumber
                          )
                        }
                        disabled={isUpdating}
                        className="w-full"
                      >
                        {isUpdating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Truck className="mr-2 h-4 w-4" />
                        )}
                        Mark as Shipped
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {order.status === "PENDING" && (
                  <Button
                    onClick={() => handleStatusUpdate(order._id, "PROCESSING")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Start Processing
                  </Button>
                )}
                {order.status === "SHIPPED" && (
                  <Button
                    onClick={() => handleStatusUpdate(order._id, "DELIVERED")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Mark Delivered
                  </Button>
                )}
                {(order.status === "PENDING" ||
                  order.status === "PROCESSING") && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Cancel Order
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              Order not found
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
