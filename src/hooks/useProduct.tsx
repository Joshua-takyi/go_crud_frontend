'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export interface ProductProps {
  _id?: string;
  title: string;
  description: string;
  price?: number;
  image?: string[];
  category?: string;
  tags: string[];
  completed: boolean;
  metadata: {
    created_at?: Date | string;
    updated_at?: Date | string;
  };
  priority: 'low' | 'medium' | 'high';
}

export interface ProductFormData {
  title: string;
  description: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  image?: string[];
  completed?: boolean;
}

export interface PaginationMetadata {
  hasMore: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface TasksResponse {
  tasks: ProductProps[];
  pagination: PaginationMetadata;
}

const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV;

// Log API URL for debugging
if (typeof window !== 'undefined') {
  console.debug('API URL configured as:', API_URL);
}

export default function useProduct() {
  const queryClient = useQueryClient();

  // Get all products with pagination
  const useAllProducts = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['products', page, limit],
      queryFn: async () => {
        try {
          const res = await axios.get(`${API_URL}/tasks`, {
            params: { page, limit },
          });
          return {
            tasks: res.data.tasks,
            pagination: res.data.pagination,
          } as TasksResponse;
        } catch (error) {
          const axiosError = error as AxiosError;
          throw new Error(axiosError.message || 'Failed to fetch tasks');
        }
      },
    });
  };

  // Get single product
  const useProductById = (id: string) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: async () => {
        try {
          const res = await axios.get(`${API_URL}/tasks/${id}`);
          return res.data.task;
        } catch (error) {
          const axiosError = error as AxiosError;
          throw new Error(axiosError.message || 'Failed to fetch task');
        }
      },
      enabled: !!id,
    });
  };

  // Create product
  const createProduct = useMutation({
    mutationFn: async (data: ProductFormData) => {
      try {
        const res = await axios.post(`${API_URL}/tasks`, data);
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message || 'Failed to create task');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Update product
  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      try {
        const res = await axios.patch(`${API_URL}/tasks/${id}`, data);
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message || 'Failed to update task');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });

  // Delete product
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await axios.delete(`${API_URL}/tasks/${id}`);
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message || 'Failed to delete task');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Toggle completion status
  const toggleCompleteStatus = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      try {
        const res = await axios.patch(`${API_URL}/tasks/${id}/complete`, { completed });
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message || 'Failed to update status');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });

  return {
    useAllProducts,
    useProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleCompleteStatus,
  };
}
