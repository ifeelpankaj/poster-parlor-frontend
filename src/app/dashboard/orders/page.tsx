"use client";

import { useState } from "react";
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
import { Plus, Search } from "lucide-react";

const allOrders = [
  {
    id: "ORD-001",
    customer: "John Anderson",
    amount: "$349.99",
    date: "Dec 20, 2025",
    status: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    amount: "$89.99",
    date: "Dec 19, 2025",
    status: "Pending",
  },
  {
    id: "ORD-003",
    customer: "Michael Johnson",
    amount: "$199.99",
    date: "Dec 18, 2025",
    status: "Processing",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    amount: "$459.99",
    date: "Dec 17, 2025",
    status: "Delivered",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    amount: "$129.99",
    date: "Dec 16, 2025",
    status: "Shipped",
  },
  {
    id: "ORD-006",
    customer: "Lisa Martinez",
    amount: "$279.99",
    date: "Dec 15, 2025",
    status: "Processing",
  },
  {
    id: "ORD-007",
    customer: "James Davis",
    amount: "$199.99",
    date: "Dec 14, 2025",
    status: "Cancelled",
  },
  {
    id: "ORD-008",
    customer: "Jennifer Lee",
    amount: "$559.99",
    date: "Dec 13, 2025",
    status: "Delivered",
  },
];

const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "Shipped":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "Processing":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "Pending":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400";
      case "Cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all orders
          </p>
        </div>
        <Button className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by order ID or customer..."
                className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Order ID
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Amount
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {order.customer}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-semibold">
                      {order.amount}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {paginatedOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No orders found
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
    </div>
  );
}
