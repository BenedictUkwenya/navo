"use client";

import type React from "react";
import type { PaginationData } from "../../types/exchange-rate";

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { current_page, total_pages } = pagination;

  if (total_pages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, current_page - 2);
    const endPage = Math.min(total_pages, current_page + 2);

    // Previous button
    if (current_page > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => onPageChange(current_page - 1)}
          className="pagination-btn"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-btn ${i === current_page ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (current_page < total_pages) {
      buttons.push(
        <button
          key="next"
          onClick={() => onPageChange(current_page + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  return <div className="pagination">{renderPageButtons()}</div>;
};

export default Pagination;
