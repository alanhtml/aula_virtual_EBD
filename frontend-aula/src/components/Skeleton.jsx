import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-glass-fill border border-glass-border/30 rounded-md ${className}`}></div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      {/* Welcome Section Skeleton */}
      <section className="flex flex-col gap-2 mt-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </section>

      {/* Stats Bar Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-8 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </div>
        ))}
      </section>

      {/* Activity Section Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 py-4 border-b border-glass-border/50">
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-xl p-8">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const CourseGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass-card p-6 rounded-2xl flex flex-col gap-4 border border-glass-border">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>
          <div className="flex flex-col gap-2 border-t border-glass-border pt-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 w-10 rounded-lg" />
            <Skeleton className="h-8 w-10 rounded-lg" />
            <Skeleton className="h-8 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const UsersTableSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-glass-border mt-8">
      <div className="bg-glass-fill/80 p-6 border-b border-glass-border">
        <div className="flex gap-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="p-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-8 py-5 px-8 border-b border-glass-border/20">
            <div className="flex items-center gap-5 flex-1">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ModuleSkeleton = () => {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
            <Skeleton className="h-14 w-48 rounded-2xl" />
          </div>
        </div>

        {/* Content Tabs Skeleton */}
        <div className="flex gap-4 p-1.5 bg-glass-fill rounded-2xl border border-glass-border w-fit">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Sections Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden border border-glass-border">
              <div className="p-6 bg-glass-fill/50 border-b border-glass-border flex justify-between items-center">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center gap-4 p-4 bg-glass-fill/30 rounded-xl">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export const EscuelaBiblicaSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center mt-8">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-6 w-[500px]" />
        </div>
        <div className="flex gap-4">
           <Skeleton className="h-12 w-40 rounded-2xl" />
           <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card p-8 rounded-3xl border border-glass-border">
            <Skeleton className="w-14 h-14 rounded-2xl mb-6" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-10 w-full mb-6" />
            <div className="flex items-center justify-between border-t border-glass-border pt-4">
               <Skeleton className="h-4 w-20" />
               <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
