// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     credentials: 'include',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('admin_token');
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['Tables', 'Menu', 'Orders'],
//   endpoints: () => ({}),
// });
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result: any = await rawBaseQuery(args, api, extraOptions);

  // Case 1: Backend returns HTTP 401
  if (result?.error?.status === 401) {
    localStorage.clear();
    window.location.reload();
  }

  // Case 2: Backend returns custom response
  if (
    result?.data?.status === false &&
    result?.data?.message === 'Token expired'
  ) {
    localStorage.clear();
    window.location.reload();
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Tables', 'Menu', 'Orders'],
  endpoints: () => ({}),
});