import type { MenuItem, PaginatedResponse } from '../types';
import { mockMenuItems } from '../mocks/mockData';
import axiosInstance from './axiosInstance';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMenuItems(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<MenuItem>> {
  const menu = await axiosInstance.get(`/menu?page=${page}&limit=${limit}`);
  return menu.data;

}
