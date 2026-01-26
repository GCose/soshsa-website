import { TableProps } from "@/types/interface/dashboard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const getShowingText = () => {
    if (!pagination || pagination.totalPages === 0) return null;

    const limit = 30;
    const start = (pagination.page - 1) * limit + 1;
    const end = Math.min(pagination.page * limit, pagination.total || 0);
    const total = pagination.total || 0;

    return `Showing ${start} to ${end} of ${total}`;
  };

  return (
    <div>
      <div className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-navy/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-navy/20 dark:border-white/20 border-t-navy dark:border-t-white rounded-full animate-spin"></div>
              <p className="text-sm text-navy dark:text-white uppercase tracking-wider">
                Loading...
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-teal-50">
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
                    className={`even:bg-teal-50/70 ${
                      onRowClick
                        ? "hover:bg-teal-100/35 cursor-pointer"
                        : ""
                    } transition-colors`}
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
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm  /60">
            {getShowingText()}
          </p>
          {pagination.totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-navy border border-black/10 dark:border-white/10 text-navy dark:text-white text-sm uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-navy border border-black/10 dark:border-white/10 text-navy dark:text-white text-sm uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Table;
