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

const allCustomers = [
  {
    id: 1,
    name: "John Anderson",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    city: "New York",
    orders: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    city: "Los Angeles",
    orders: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+1 (555) 345-6789",
    city: "Chicago",
    orders: 0,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily@example.com",
    phone: "+1 (555) 456-7890",
    city: "Houston",
    orders: 15,
    status: "Active",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 567-8901",
    city: "Phoenix",
    orders: 5,
    status: "Active",
  },
  {
    id: 6,
    name: "Lisa Martinez",
    email: "lisa@example.com",
    phone: "+1 (555) 678-9012",
    city: "Miami",
    orders: 9,
    status: "Active",
  },
  {
    id: 7,
    name: "James Davis",
    email: "james@example.com",
    phone: "+1 (555) 789-0123",
    city: "Denver",
    orders: 0,
    status: "Inactive",
  },
  {
    id: 8,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    phone: "+1 (555) 890-1234",
    city: "Seattle",
    orders: 20,
    status: "Active",
  },
];

const ITEMS_PER_PAGE = 5;

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer base
          </p>
        </div>
        <Button className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
          <Plus className="h-4 w-4" />
          Add Customer
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
                placeholder="Search customers by name or email..."
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
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    City
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Orders
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {customer.city}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-semibold">
                      {customer.orders}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          customer.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {paginatedCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No customers found
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
