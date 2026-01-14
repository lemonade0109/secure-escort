"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl = "",
}) => {
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-4 px-2 py-4">
      {/* Page Info */}
      <div className="text-sm text-white/60">
        Page <span className="font-medium text-white">{currentPage}</span> of{" "}
        <span className="font-medium text-white">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <Button
          asChild
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          className="w-8 h-8 text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPage === 1 ? (
            <span>
              <ChevronsLeft className="w-4 h-4" />
            </span>
          ) : (
            <Link href={createPageUrl(1)} aria-label="First page">
              <ChevronsLeft className="w-4 h-4" />
            </Link>
          )}
        </Button>

        {/* Previous Page */}
        <Button
          asChild
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          className="w-8 h-8 text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPage === 1 ? (
            <span>
              <ChevronLeft className="w-4 h-4" />
            </span>
          ) : (
            <Link
              href={createPageUrl(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-8 h-8 text-white/60"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNumber}
                asChild={pageNumber !== currentPage}
                variant="outline"
                size="icon"
                className={`w-8 h-8 ${
                  pageNumber === currentPage
                    ? "bg-white/10 text-white border-white/30 font-semibold cursor-default"
                    : "text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
                }`}
              >
                {pageNumber === currentPage ? (
                  <span>{pageNumber}</span>
                ) : (
                  <Link href={createPageUrl(pageNumber as number)}>
                    {pageNumber}
                  </Link>
                )}
              </Button>
            )
          )}
        </div>

        {/* Next Page */}
        <Button
          asChild
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          className="w-8 h-8 text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPage === totalPages ? (
            <span>
              <ChevronRight className="w-4 h-4" />
            </span>
          ) : (
            <Link href={createPageUrl(currentPage + 1)} aria-label="Next page">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </Button>

        {/* Last Page */}
        <Button
          asChild
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          className="w-8 h-8 text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPage === totalPages ? (
            <span>
              <ChevronsRight className="w-4 h-4" />
            </span>
          ) : (
            <Link href={createPageUrl(totalPages)} aria-label="Last page">
              <ChevronsRight className="w-4 h-4" />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
};
