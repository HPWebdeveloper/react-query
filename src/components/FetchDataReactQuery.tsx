// React Query is a powerful library for managing server state in React applications.
// It handles caching, background updates, and synchronization automatically.
import { useQuery } from "@tanstack/react-query";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * FETCHER FUNCTION:
 * This is a standard async function that performs the actual HTTP request.
 * React Query will call this function when it needs to fetch or refetch data.
 *
 * Important points:
 * - Must be async or return a Promise
 * - Should throw an error on failure (React Query will catch it automatically)
 * - The return type (Promise<Post[]>) tells TypeScript what data shape to expect
 * - This function is PURE - no side effects, just fetch and return
 */
const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("http://localhost:3000/api/posts");
  if (!response.ok) {
    // Throwing an error here will trigger React Query's error state
    throw new Error("Failed to fetch data");
  }
  return response.json() as Promise<Post[]>;
};

// Or using Promise syntax:
/* const fetchPosts = (): Promise<Post[]> => {
  return fetch("http://localhost:3000/api/posts")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json() as Promise<Post[]>;
    });
}; */

function FetchDataReactQuery() {
  /**
   * useQuery HOOK:
   * This is the heart of React Query. It manages the entire lifecycle of your data fetching.
   *
   * It returns an object with many useful properties, but we're using these four:
   *
   * 1. data: The successfully fetched data (Post[] in our case)
   *    - Initially undefined until first successful fetch
   *    - Automatically typed based on your queryFn return type
   *    - Cached in memory, so subsequent renders don't refetch
   *
   * 2. isLoading: Boolean indicating if the query is currently fetching for the FIRST time
   *    - true: First fetch is in progress
   *    - false: Either not fetching, or this is a refetch (not first fetch)
   *    - Different from isFetching (which includes background refetches)
   *
   * 3. error: Contains any error thrown by the queryFn
   *    - null if no error occurred
   *    - Automatically typed as Error | null
   *    - React Query catches errors from queryFn automatically
   *
   * 4. refetch: A function to manually trigger a new fetch
   *    - Useful for "fetch on click" scenarios like ours
   *    - Returns a promise that resolves with the query result
   *    - Can be called any time to get fresh data
   */
  const { data, isLoading, error, refetch } = useQuery({
    /**
     * queryKey: Unique identifier for this query
     * - Acts as a **cache key** - React Query uses this to store and retrieve cached data
     * - Format: array with any serializable values ['posts'] or ['posts', userId]
     * - If you have multiple queries with same key, they share the same cache
     * - Changing the key triggers a new fetch (useful for parameterized queries)
     * - Think of it like a database primary key for your cached data
     */
    queryKey: ["posts"],

    /**
     * queryFn: The function that actually fetches the data
     * - Must return a Promise that resolves to your data
     * - React Query calls this function when:
     *   1. Component mounts (if enabled is true)
     *   2. Window regains focus (configurable)
     *   3. Network reconnects (configurable)
     *   4. Manually via refetch()
     * - Any error thrown here is caught and stored in the 'error' property
     */
    queryFn: fetchPosts,

    /**
     * enabled: Controls whether the query should run automatically
     * - false: Query will NOT run on mount or in response to trigger events
     * - true (default): Query runs automatically when component mounts
     * - We set it to false because we want user to click button first
     * - Even with enabled:false, refetch() still works to manually trigger fetch
     * - Useful for: conditional fetching, fetch on user action, or dependent queries
     */
    enabled: false,

    // OTHER COMMON OPTIONS (not used here, but good to know):
    // staleTime: How long data is considered "fresh" before refetching (default: 0)
    // cacheTime: How long unused data stays in cache (default: 5 minutes)
    // retry: Number of retry attempts on failure (default: 3)
    // refetchOnWindowFocus: Refetch when user returns to tab (default: true)
    // onSuccess: Callback function when query succeeds
    // onError: Callback function when query fails
  });

  const hasPosts = data && data.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 mt-10 border-t-2 border-emerald-500">
      <h2 className="text-3xl font-semibold mb-6">
        Fetch Data with React Query (tanstack/react-query)
      </h2>

      {/*
        MANUAL FETCH TRIGGER:
        When user clicks, we call refetch() which manually triggers the query.

        Benefits of refetch():
        - Returns a promise, so you can await it or chain .then()
        - Respects all query options (retry, cache, etc.)
        - Updates isLoading, data, and error automatically
        - React Query handles all the state management for you

        Compare to manual fetch:
        - No need to manually set loading state
        - No need to manually handle errors
        - No need to manually store data
        - React Query does all of this automatically!
      */}
      <button
        onClick={() => refetch()}
        disabled={isLoading}
        className={`px-5 py-2.5 text-base font-medium text-white bg-emerald-500 rounded-lg mb-5 transition-colors ${
          isLoading ? "cursor-not-allowed opacity-60" : "hover:bg-emerald-600"
        }`}
      >
        {/*
          isLoading is automatically managed by React Query.
          No need to create and manage a separate loading state with useState!
        */}
        {isLoading ? "Loading..." : "Fetch"}
      </button>

      {/*
        ERROR HANDLING:
        React Query automatically catches errors thrown in queryFn.
        The 'error' variable contains the error object or null.

        Advantages:
        - No try/catch needed in the component
        - Error state persists across renders
        - Can configure retry behavior globally or per-query
        - Error is cleared automatically on successful refetch
      */}
      {error && (
        <div className="text-red-400 mb-5 p-2.5 bg-red-900/30 rounded-lg border border-red-500/50">
          Error: {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      {/*
        DATA RENDERING:
        React Query provides the 'data' variable which contains your fetched data.

        Key points:
        - data is undefined before first successful fetch
        - data persists even after component unmounts (cached!)
        - If you navigate away and come back, data shows immediately (from cache)
        - React Query can show stale data while refetching in background
        - No manual state management needed - React Query handles everything

        This is HUGE compared to manual fetch:
        - No useState for data
        - No useEffect for fetching
        - No race condition handling
        - No duplicate request prevention
        - All handled by React Query automatically!
      */}
      {hasPosts && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Posts ({data.length})</h3>
          {data.map((post) => (
            <div
              key={post.id}
              className="border border-gray-700 p-4 mb-2.5 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors"
            >
              <h4 className="mt-0 mb-2 text-emerald-400 text-xl font-medium">
                {post.title}
              </h4>
              <p className="text-gray-300 mb-2">{post.body}</p>
              <small className="text-gray-500">
                Post ID: {post.id} | User ID: {post.userId}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FetchDataReactQuery;
