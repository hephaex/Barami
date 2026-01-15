const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
