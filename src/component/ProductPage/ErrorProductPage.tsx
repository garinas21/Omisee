const ProductError = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => {
  return (
    <div className="flex flex-col justify-center items-center rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
      <p className="mb-3 font-bold">Failed to load product</p>
      <p className="text-sm opacity-90">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        TryAgain
      </button>
    </div>
  );
};

export default ProductError;
