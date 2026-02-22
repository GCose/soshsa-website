export const NewsCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="relative h-96 bg-gray-200 mb-4"></div>
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export const MagazineSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-3/4 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-5 bg-gray-200 rounded w-20"></div>
      <div className="h-4 bg-gray-200 rounded w-14"></div>
    </div>
  </div>
);

export const EventSkeleton = () => (
  <div className="animate-pulse">
    <div className="relative h-96 bg-gray-200 mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export const HomeEventsSkeletonGrid = () => (
  <div className="grid grid-cols-12 gap-6 lg:gap-8 animate-pulse">
    <div className="col-span-12 lg:col-span-7">
      <div className="h-[800px] bg-gray-200"></div>
    </div>
    <div className="col-span-12 lg:col-span-5 space-y-6">
      <div className="h-[390px] bg-gray-200"></div>
      <div className="h-[390px] bg-gray-200"></div>
    </div>
  </div>
);

export const HomeMagazineSkeletonGrid = () => (
  <div className="grid grid-cols-12 gap-6 animate-pulse">
    <div className="col-span-12 sm:col-span-6 lg:col-span-7">
      <div className="bg-gray-700 aspect-3/4 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-600 rounded w-24"></div>
        <div className="h-4 bg-gray-600 rounded w-16"></div>
      </div>
    </div>
    <div className="col-span-12 sm:col-span-6 lg:col-span-5 lg:mt-12">
      <div className="mb-8">
        <div className="bg-gray-700 aspect-3/4 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-600 rounded w-20"></div>
          <div className="h-4 bg-gray-600 rounded w-14"></div>
        </div>
      </div>
      <div>
        <div className="bg-gray-700 aspect-3/4 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-600 rounded w-20"></div>
          <div className="h-4 bg-gray-600 rounded w-14"></div>
        </div>
      </div>
    </div>
  </div>
);

export const MagazineArticlesSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 rounded-lg border border-gray-200">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded bg-gray-200 shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ArticleDetailSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
    <div className="relative aspect-video bg-gray-200 rounded-lg mb-8"></div>
    <div className="space-y-3 mb-6">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="flex items-center gap-4 mb-8">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
      ))}
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export const MagazineDetailSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
      <div className="lg:col-span-1">
        <div className="bg-gray-200 aspect-3/4 rounded-lg"></div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded w-48 mt-8"></div>
        <MagazineArticlesSkeleton />
      </div>
    </div>
  </div>
);
