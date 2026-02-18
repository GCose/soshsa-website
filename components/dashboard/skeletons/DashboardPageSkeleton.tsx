const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-15">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-teal-100 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-teal-50 rounded" />
                <div className="h-9 w-16 bg-teal-50 rounded" />
              </div>
              <div className="h-12 w-12 bg-teal-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-52 bg-teal-100 rounded" />
          <div className="h-4 w-16 bg-teal-100 rounded" />
        </div>

        <div className="rounded-lg overflow-hidden">
          <div className="bg-teal-100 grid grid-cols-5 gap-4 py-4 px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-teal-100 rounded" />
            ))}
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 py-4 px-6 even:bg-gray-100/70"
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3 bg-gray-50 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
