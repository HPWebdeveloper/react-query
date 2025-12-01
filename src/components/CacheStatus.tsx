interface CacheStatusProps {
  isFetching: boolean;
}

function CacheStatus({ isFetching }: CacheStatusProps) {
  return (
    <p className="text-sm mt-2">
      {isFetching ? (
        <span className="text-blue-400">
          🔄 Fetching fresh data from server...
        </span>
      ) : (
        <span className="text-green-400">
          ✨ Served from cache (no network request)
        </span>
      )}
    </p>
  );
}

export default CacheStatus;
