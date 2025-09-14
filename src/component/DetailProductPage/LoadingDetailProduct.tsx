const LoadingDetailPage = () => {
  return (
    <section className="mx-auto my-6 flex min-h-screen max-w-7xl flex-col gap-10 px-30 rounded-2xl bg-white p-8 shadow-lg md:flex-row animate-pulse">
      <div className="flex w-full flex-col gap-4 md:w-2/5">
        <div className="h-96 w-full rounded-xl bg-neutral-200" />
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-16 rounded-md bg-neutral-200" />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:w-3/5">
        <div className="h-8 w-2/3 rounded bg-neutral-200" />
        <div className="h-4 w-full rounded bg-neutral-200" />
        <div className="h-32 w-full rounded bg-neutral-200" />
        <div className="h-10 w-1/3 rounded bg-neutral-200" />
      </div>
    </section>
  );
};

export default LoadingDetailPage;
