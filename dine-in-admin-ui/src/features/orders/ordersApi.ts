import { apiSlice } from '@api/apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<any[], void>({
      query: () => '/admin/orders',
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
    verifyPayment: builder.mutation<any, string>({
      query: (orderId) => ({
        url: `/admin/payments/${orderId}/verify`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useVerifyPaymentMutation,
} = ordersApi;
