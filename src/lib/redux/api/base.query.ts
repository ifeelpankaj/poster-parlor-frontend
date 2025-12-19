import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // ✅ This sends cookies automatically
  prepareHeaders: (headers) => {
    return headers;
  },
});
/**
 * 🔐 In-memory refresh state (PER USER / PER TAB)
 */
let refreshPromise: Promise<void> | null = null;
let refreshFailed = false;

/**
 * 🔄 Reset refresh state (call on login / logout)
 */
export const resetRefreshState = () => {
  refreshPromise = null;
  refreshFailed = false;
};
/**
 * 🚀 Base query with refresh lock + failure cache
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (refreshFailed) {
      api.dispatch({ type: "auth/clearAuth" });
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = (async (): Promise<void> => {
        try {
          const refreshResult = await baseQuery(
            { url: "/auth/google/refresh", method: "POST" },
            api,
            extraOptions
          );

          if (refreshResult.error || !refreshResult.data) {
            refreshFailed = true;
            api.dispatch({ type: "auth/clearAuth" });
            throw new Error("Refresh failed");
          }

          refreshFailed = false; // ✅ Reset on success
        } catch (error) {
          refreshFailed = true;
          api.dispatch({ type: "auth/clearAuth" });
          throw error;
        }
      })().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;
      result = await baseQuery(args, api, extraOptions);
    } catch {
      // Refresh failed, return original 401
      return result;
    }
  }

  return result;
};
