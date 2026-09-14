import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-6 py-20">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-6 w-96" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </main>
  );
}
