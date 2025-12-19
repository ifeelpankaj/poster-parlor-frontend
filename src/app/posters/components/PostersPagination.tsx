"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      if (totalPages <= 5) {
        return i + 1;
      } else if (page <= 3) {
        return i + 1;
      } else if (page >= totalPages - 2) {
        return totalPages - 4 + i;
      } else {
        return page - 2 + i;
      }
    });
  };

  return (
    <div className="border-t pt-6 sm:pt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
          Page <span className="text-foreground font-semibold">{page}</span> of{" "}
          <span className="text-foreground font-semibold">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={!hasPrev}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className="hidden md:flex gap-2">
            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10",
                  page === pageNum && "pointer-events-none"
                )}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={!hasNext}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
