"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemNme?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemNme = "Items",
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 3;

    visiblePages.push(1);

    if (currentPage > maxVisible + 1) {
      visiblePages.push("...");
    }

    const startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxVisible / 2)
    );

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        visiblePages.push(i);
      }
    }

    if (currentPage < totalPages - maxVisible) {
      visiblePages.push("...");
    }

    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col items-center space-y-4 mt-6">
      <div className="text-sm text-black dark:text-white">
        {totalItems > 0
          ? `${startIndex} – ${endIndex} of ${totalItems} ${itemNme}`
          : `0 ${itemNme}`}
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-full border cursor-pointer dark:border-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full border cursor-pointer dark:border-white"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          return (
            <Button
              key={page}
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 rounded-full ${
                currentPage === page
                  ? "bg-[#dfa32a] cursor-pointer hover:bg-[#dfa32a] hover:dark:bg-[#dfa32a] text-white"
                  : "hover:bg-[#dfa32a] hover:dark:bg-[#dfa32a] cursor-pointer border dark:border-white"
              }`}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-full border cursor-pointer dark:border-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
