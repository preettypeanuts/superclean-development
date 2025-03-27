import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { TbChevronsLeft, TbChevronsRight, TbChevronLeft, TbChevronRight } from "react-icons/tb";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationNumber({ totalPages, currentPage, onPageChange }: PaginationProps) {
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

        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === index + 1}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
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

