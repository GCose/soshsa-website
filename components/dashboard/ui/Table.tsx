import { TableProps } from "@/types/interface/dashboard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const Table = <T,>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available",
  loading = false,
  pagination,
}: TableProps<T>) => {
  const getRowKey = (row: T, index: number): string => {
    if (typeof row === "object" && row !== null) {
      if ("_id" in row && typeof row._id === "string") return row._id;
      if ("id" in row && typeof row.id === "string") return row.id;
    }
    return index.toString();
  };

  const getPageNumbers = () => {
    if (!pagination) return [];

    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getShowingText = () => {
    if (!pagination || pagination.totalPages === 0) return null;

    const limit = 15;
    const start = (pagination.page - 1) * limit + 1;
    const end = Math.min(pagination.page * limit, pagination.total || 0);
    const total = pagination.total || 0;

    return `Showing ${start} to ${end} of ${total}`;
  };

  return (
    <div>
      <div className="bg-white-lg overflow-hidden relative rounded-lg">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-full animate-spin"></div>
              <p className="text-sm text-gray-900 uppercase tracking-wider">
                Loading...
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-teal-100/70">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-4 px-6 text-sm uppercase tracking-wider text-teal-400 font-bold"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 px-6 text-center"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    onClick={() => onRowClick?.(row)}
                    className={`even:bg-gray-100/60 ${
                      onRowClick
                        ? "hover:bg-teal-50 active:bg-teal-50 cursor-pointer"
                        : ""
                    } transition-colors`}
                    style={{
                      touchAction: onRowClick ? "manipulation" : undefined,
                    }}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="py-4 px-6 text-gray-400 truncate max-w-xs"
                      >
                        {column.render
                          ? column.render(row[column.key], row, index)
                          : String(row[column.key as keyof T] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <p className="text-sm text-gray-600">{getShowingText()}</p>

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </Button>

            {getPageNumbers().map((pageNum, idx) =>
              pageNum === "..." ? (
                <span key={`ellipsis-${idx}`} className="text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  variant="secondary"
                  key={pageNum}
                  onClick={() => pagination.onPageChange(pageNum as number)}
                  className={`${
                    pagination.page === pageNum
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Button>
              ),
            )}

            <Button
              variant="secondary"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="text-gray-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Next page"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
