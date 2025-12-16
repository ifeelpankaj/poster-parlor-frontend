import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // ✅ This sends cookies automatically
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error, try to refresh the token
  if (result.error && result.error.status === 401) {
    // console.log("Access token expired, attempting refresh...");

    // Try to refresh - cookies are sent automatically
    const refreshResult = await baseQuery(
      { url: "/auth/google/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // console.log("Token refreshed successfully");
      // ✅ No need to store anything - backend sets cookies
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // console.log("Refresh failed, user needs to re-authenticate");
      // ✅ Refresh failed - dispatch logout action
      api.dispatch({ type: "auth/clearAuth" });
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    loginWithGoogle: builder.mutation({
      query: (idToken) => ({
        url: "/auth/google/login",
        method: "POST",
        body: { idToken },
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/google/refresh",
        method: "POST",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/google/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      // ✅ Clear auth state on successful logout
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch({ type: "auth/clearAuth" });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    getCurrentUser: builder.query({
      query: () => "/auth/google/me",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginWithGoogleMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;
