import { Button } from "./button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem 
} from "./pagination";

type TextPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function TextPagination({ 
  currentPage, 
  totalPages,
  onPageChange 
}: TextPaginationProps) {
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="grow text-sm text-muted-foreground" aria-live="polite">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </p>
      <Pagination className="w-auto">
        <PaginationContent className="gap-3">
          <PaginationItem>
            <Button
              variant="outline"
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={currentPage === 1}
              onClick={handlePrevClick}
            >
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={currentPage === totalPages}
              onClick={handleNextClick}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { TextPagination };