export function PropertiesListSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md">
                    <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    );
}

export function PropertyLoadingSkeleton() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        <div className="text-center text-lg text-default-600 py-20">
          Loading...
        </div>
      </div>
    );
}
