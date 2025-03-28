import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { TbChevronsLeft, TbChevronsRight, TbChevronLeft, TbChevronRight } from "react-icons/tb";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationNumber({ totalPages, currentPage, onPageChange }: PaginationProps) {
  // Hitung range angka yang akan ditampilkan
  let pages: number[] = [];
  if (totalPages <= 3) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage === 1) {
    pages = [1, 2, 3];
  } else if (currentPage === totalPages) {
    pages = [totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <TbChevronsLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <TbChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Page Numbers */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={currentPage === page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <TbChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <TbChevronsRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

