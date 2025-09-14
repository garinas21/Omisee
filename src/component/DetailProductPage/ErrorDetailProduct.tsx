const ErrorDetailPage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => {
  return (
    <div className="mx-auto my-10 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
      <h2 className="mb-2 text-lg font-semibold">Gagal memuat produk</h2>
      <p className="text-sm opacity-90">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Coba lagi
      </button>
    </div>
  );
};

export default ErrorDetailPage;
