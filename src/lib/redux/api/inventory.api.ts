import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base.query";

export interface PosterImage {
  _id: string;
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export interface Poster {
  _id: string;
  title: string;
  description: string;
  category: string;
  dimensions: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  tags: string[];
  images: PosterImage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetAllInventoryResponse {
  data: {
    posters: Poster[];
    pagination: PaginationInfo;
    filters: PosterFilter;
  };
}
export interface GetFeaturedPostersResponse {
  data: Array<Poster[]>;
}
export interface GetInventoryItemResponse {
  data: {
    poster: Poster;
  };
}

export interface SearchInventoryResponse {
  data: {
    posters: Poster[];
    total: number;
  };
}

export interface CreateInventoryResponse {
  success: boolean;
  message: string;
  data: {
    poster: Poster;
  };
}

export interface UpdateInventoryResponse {
  success: boolean;
  message: string;
  data: {
    poster: Poster;
  };
}

export interface DeleteInventoryResponse {
  success: boolean;
  message: string;
}

export interface FiltersResponse {
  data: {
    categories: string[];
    materials: string[];
    dimensions: string[];
    tags: string[];
  };
}

export interface PosterFilter {
  isAvailable?: boolean;
  category?: string;
  tags?: string | string[];
  title?: string;
  dimensions?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  search?: string;
  sortBy?: "price" | "stock" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface GetAllInventoryParams {
  page?: number;
  limit?: number;
  filters?: PosterFilter;
}

export interface CreateInventoryItemParams {
  images: File[];
  itemDetails: {
    title: string;
    description: string;
    category: string;
    dimensions: string;
    price: number;
    stock: number;
    isAvailable?: boolean;
    tags?: string[];
    material?: string;
  };
}

export interface UpdateInventoryItemParams {
  id: string;
  images?: File[];
  updateDetails: Partial<{
    title: string;
    description: string;
    category: string;
    dimensions: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    tags: string[];
    material: string;
    imagesToRemove: string[];
  }>;
}

export interface SearchInventoryParams {
  query: string;
  limit?: number;
}

// ============================================================================
// API Definition
// ============================================================================

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQuery,
  tagTypes: ["Inventory", "Filters"],
  endpoints: (builder) => ({
    // Create inventory item
    createInventoryItem: builder.mutation<
      CreateInventoryResponse,
      CreateInventoryItemParams
    >({
      query: ({ images, itemDetails }) => {
        const formData = new FormData();

        // Append images
        images.forEach((image) => {
          formData.append("images", image);
        });

        // Append item details
        Object.entries(itemDetails).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return {
          url: "",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: CreateInventoryResponse) => {
        console.log("✅ Create Inventory Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Create Inventory Error:", error);
        return error;
      },
      invalidatesTags: ["Inventory"],
    }),

    // Get all inventory items
    getAllInventory: builder.query<
      GetAllInventoryResponse,
      GetAllInventoryParams
    >({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // Add filters
        if (filters.isAvailable !== undefined) {
          params.append("isAvailable", filters.isAvailable.toString());
        }
        if (filters.category) params.append("category", filters.category);
        if (filters.title) params.append("title", filters.title);
        if (filters.dimensions) params.append("dimensions", filters.dimensions);
        if (filters.material) params.append("material", filters.material);
        if (filters.search) params.append("search", filters.search);
        if (filters.tags) {
          params.append(
            "tags",
            Array.isArray(filters.tags) ? filters.tags.join(",") : filters.tags
          );
        }
        if (filters.minPrice !== undefined)
          params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          params.append("maxPrice", filters.maxPrice.toString());
        if (filters.minStock !== undefined)
          params.append("minStock", filters.minStock.toString());
        if (filters.maxStock !== undefined)
          params.append("maxStock", filters.maxStock.toString());
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

        return `inventory?${params.toString()}`;
      },
      transformResponse: (response: GetAllInventoryResponse) => {
        console.log("✅ Get All Inventory Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Get All Inventory Error:", error);
        return error;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.posters.map(({ _id }) => ({
                type: "Inventory" as const,
                id: _id,
              })),
              { type: "Inventory" as const, id: "LIST" },
            ]
          : [{ type: "Inventory" as const, id: "LIST" }],
    }),

    // Get inventory item by ID
    getInventoryItemById: builder.query<GetInventoryItemResponse, string>({
      query: (id) => `/inventory/${id}`,
      transformResponse: (response: GetInventoryItemResponse) => {
        console.log("✅ Get Inventory Item Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Get Inventory Item Error:", error);
        return error;
      },
      providesTags: (result, error, id) => [{ type: "Inventory", id }],
    }),

    // Search inventory items
    searchInventoryItems: builder.query<
      SearchInventoryResponse,
      SearchInventoryParams
    >({
      query: ({ query, limit = 20 }) =>
        `/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      transformResponse: (response: SearchInventoryResponse) => {
        console.log("✅ Search Inventory Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Search Inventory Error:", error);
        return error;
      },
    }),

    // Update inventory item
    updateInventoryItem: builder.mutation<
      UpdateInventoryResponse,
      UpdateInventoryItemParams
    >({
      query: ({ id, images = [], updateDetails }) => {
        const formData = new FormData();

        // Append new images
        images.forEach((image) => {
          formData.append("images", image);
        });

        // Append update details
        Object.entries(updateDetails).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return {
          url: `/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response: UpdateInventoryResponse) => {
        console.log("✅ Update Inventory Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Update Inventory Error:", error);
        return error;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Inventory", id },
        { type: "Inventory", id: "LIST" },
      ],
    }),
    // Get featured posters
    getFeaturedPosters: builder.query({
      query: () => `inventory/featured`,
    }),
    // Get all filters/categories
    getAllFilters: builder.query<FiltersResponse, void>({
      query: () => "inventory/categories/list",
      transformResponse: (response: FiltersResponse) => {
        console.log("✅ Get Filters Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Get Filters Error:", error);
        return error;
      },
      providesTags: ["Filters"],
    }),

    // Soft delete inventory item
    softDeleteInventoryItem: builder.mutation<DeleteInventoryResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteInventoryResponse) => {
        console.log("✅ Soft Delete Inventory Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Soft Delete Inventory Error:", error);
        return error;
      },
      invalidatesTags: (result, error, id) => [
        { type: "Inventory", id },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // Hard delete inventory item
    deleteInventoryItem: builder.mutation<DeleteInventoryResponse, string>({
      query: (id) => ({
        url: `/${id}/hard`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteInventoryResponse) => {
        console.log("✅ Hard Delete Inventory Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Hard Delete Inventory Error:", error);
        return error;
      },
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useCreateInventoryItemMutation,
  useGetAllInventoryQuery,
  useGetInventoryItemByIdQuery,
  useGetFeaturedPostersQuery,
  useSearchInventoryItemsQuery,
  useLazySearchInventoryItemsQuery,
  useUpdateInventoryItemMutation,
  useGetAllFiltersQuery,
  useSoftDeleteInventoryItemMutation,
  useDeleteInventoryItemMutation,
} = inventoryApi;
