import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Pagination, PaginationContent, PaginationItem } from "../ui/pagination";

interface NotesPaginationProps {
  numberOfPages?: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export function NotesListPagination({ numberOfPages = 1, currentPage, setPage }: NotesPaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <Button
          variant={currentPage === 1 ? "outline" : "ghost"}
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          <ChevronLeftIcon data-icon="inline-start" />
          <span className="hidden sm:block">Previous</span>
        </Button>
        {Array.from({ length: numberOfPages }, (_, i) => (
          <PaginationItem key={i}>
            <Button variant={i + 1 === currentPage ? "default" : "ghost"} onClick={() => setPage && setPage(i + 1)}>
              {i + 1}
            </Button>
          </PaginationItem>
        ))}
        <Button
          variant={currentPage === numberOfPages ? "outline" : "ghost"}
          disabled={currentPage === numberOfPages}
          onClick={() => setPage(currentPage + 1)}
        >
          <span className="hidden sm:block">Next</span>
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </PaginationContent>
    </Pagination>
  );
}
