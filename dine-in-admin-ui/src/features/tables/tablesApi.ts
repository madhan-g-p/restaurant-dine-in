import { apiSlice } from '@api/apiSlice';

export const tablesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTables: builder.query<any[], number | void>({
      query: (floor) => ({
        url: '/admin/tables',
        params: { floor },
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tables' as const, id: _id })),
              { type: 'Tables', id: 'LIST' },
            ]
          : [{ type: 'Tables', id: 'LIST' }],
    }),
    createTable: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/tables',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Tables', id: 'LIST' }],
    }),
    updateTable: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/tables/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tables', id }],
    }),
    deleteTable: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/tables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tables', id: 'LIST' }],
    }),
    setTableStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/tables/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tables', id }],
    }),
  }),
});

export const {
  useGetAdminTablesQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useSetTableStatusMutation,
} = tablesApi;
