"use client";
import {Button} from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {ChevronLeftIcon, ChevronRightIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import styles from "./Pagination.module.scss";

export default function PaginationSection({
  totalItems,
  totalPages,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalItems?: number;
  totalPages: number;
  itemsPerPage?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <Pagination>
      <PaginationContent className="cursor-pointer gap-2">
        <PaginationItem className={styles.paginationItem}>
          <Button onClick={() => handlePrevPage()} variant={"outline"}>
            <ChevronLeftIcon className="size-4" />
          </Button>
        </PaginationItem>
        {pages.map((page, idx) => (
          <PaginationItem
            key={idx}
            className={clsx(
              styles.paginationItem,
              currentPage === page && styles.active
            )}
          >
            <PaginationLink onClick={() => setCurrentPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem className={styles.paginationItem}>
          <Button onClick={() => handleNextPage()} variant={"outline"}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
