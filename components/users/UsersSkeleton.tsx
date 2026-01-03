import React from "react";

export function UsersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
            <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
      ))}
    </div>
  );
}
