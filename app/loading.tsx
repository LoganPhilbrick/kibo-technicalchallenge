export default function Loading() {
  return (
    <main className="max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="h-9 w-40 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-9 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </header>

      <div className="flex flex-col gap-8">
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col md:flex-row">
            <div className="aspect-[4/3] w-full animate-pulse bg-neutral-100 sm:aspect-[16/9] md:min-h-[220px] md:w-[42%] dark:bg-neutral-900" />
            <div className="flex flex-1 flex-col gap-3 border-t border-neutral-200 p-5 md:border-l md:border-t-0 md:p-6 dark:border-neutral-800">
              <div className="h-8 w-3/4 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-8 w-28 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-10 w-28 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <li
              key={index}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="aspect-square w-full animate-pulse bg-neutral-100 dark:bg-neutral-900" />
              <div className="flex flex-col gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
                <div className="h-5 w-5/6 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-6 w-24 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-2 h-10 w-28 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
