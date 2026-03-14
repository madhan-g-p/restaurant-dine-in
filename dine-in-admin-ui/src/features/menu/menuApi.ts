import { apiSlice } from '@api/apiSlice';

export const menuApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCategories: builder.query<any[], void>({
      query: () => '/admin/menu/categories',
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Menu' as const, id: _id })),
              { type: 'Menu', id: 'CAT_LIST' },
            ]
          : [{ type: 'Menu', id: 'CAT_LIST' }],
    }),
    createCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/menu/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menu', id: 'CAT_LIST' }],
    }),
    updateCategory: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/menu/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Menu', id }],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/menu/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menu', id: 'CAT_LIST' }],
    }),

    getAdminItems: builder.query<any[], string>({
      query: (categoryId) => `/admin/menu/categories/${categoryId}`,
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: (result, error, categoryId) => [{ type: 'Menu', id: `ITEMS_${categoryId}` }],
    }),
    createItem: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/menu/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => 
        result ? [{ type: 'Menu', id: `ITEMS_${result.category}` }] : [],
    }),
    updateItem: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/menu/items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      // This is trickier since we need the category ID to invalidate. 
      // Simplified: invalidate all item lists if we don't have category ID.
      // Or we can rely on result if backend returns updated item.
      invalidatesTags: (result) => 
        result ? [{ type: 'Menu', id: `ITEMS_${result.category}` }] : [],
    }),
    deleteItem: builder.mutation<any, { id: string; categoryId: string }>({
      query: ({ id }) => ({
        url: `/admin/menu/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { categoryId }) => [{ type: 'Menu', id: `ITEMS_${categoryId}` }],
    }),
  }),
});

export const {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = menuApi;
