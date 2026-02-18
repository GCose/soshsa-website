const CouncilsPageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-teal-50 grid grid-cols-5 gap-4 py-4 px-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 py-4 px-6 border-b border-gray-200"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-3 bg-gray-200 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouncilsPageSkeleton;
