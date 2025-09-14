const ProductLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm animate-pulse"
        >
          <div className="mb-3 aspect-[4/3] w-full rounded-xl bg-neutral-200" />
          <div className="mb-2 h-4 w-3/5 rounded bg-neutral-200" />
          <div className="mb-2 h-4 w-4/5 rounded bg-neutral-200" />
          <div className="mt-4 h-8 w-full rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
};

export default ProductLoading;
