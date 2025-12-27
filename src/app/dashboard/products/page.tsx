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
import { useRouter } from "next/navigation";

const allProducts = [
  {
    id: 1,
    name: "Classic Poster",
    category: "Art",
    price: "$29.99",
    stock: 150,
    status: "Active",
  },
  {
    id: 2,
    name: "Vintage Poster",
    category: "Vintage",
    price: "$39.99",
    stock: 85,
    status: "Active",
  },
  {
    id: 3,
    name: "Modern Art Print",
    category: "Modern",
    price: "$45.99",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Abstract Design",
    category: "Abstract",
    price: "$34.99",
    stock: 120,
    status: "Active",
  },
  {
    id: 5,
    name: "Nature Photography",
    category: "Photography",
    price: "$49.99",
    stock: 200,
    status: "Active",
  },
  {
    id: 6,
    name: "City Skyline",
    category: "Urban",
    price: "$44.99",
    stock: 75,
    status: "Active",
  },
  {
    id: 7,
    name: "Minimalist Design",
    category: "Minimalist",
    price: "$24.99",
    stock: 250,
    status: "Active",
  },
  {
    id: 8,
    name: "Retro Poster",
    category: "Retro",
    price: "$32.99",
    stock: 0,
    status: "Out of Stock",
  },
];

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const categories = ["all", ...new Set(allProducts.map((p) => p.category))];
  const handleOnAddProduct = () => {
    router.push("/dashboard/products/add");
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your poster collection
          </p>
        </div>
        <Button
          className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          onClick={handleOnAddProduct}
        >
          <Plus className="h-4 w-4" />
          Add Product
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
                placeholder="Search products..."
                className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">
            Products ({filteredProducts.length})
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
                    Category
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Price
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Stock
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-semibold">
                      {product.price}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        }`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {paginatedProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No products found
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
