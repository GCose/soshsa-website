const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-15">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-teal-300 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-9 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-52 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        <div className="rounded-lg overflow-hidden">
          <div className="bg-teal-50 grid grid-cols-5 gap-4 py-4 px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 py-4 px-6 border-b border-teal-200"
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3 bg-gray-200 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
