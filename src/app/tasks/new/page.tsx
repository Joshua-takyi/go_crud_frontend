'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useProduct, { ProductFormData } from '@/hooks/useProduct';
import TaskForm from '@/components/task/TaskForm';

export default function CreateTaskPage() {
  const router = useRouter();
  const { createProduct } = useProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await createProduct.mutateAsync(formData);
      router.push('/');
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <svg
              className="mr-1 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in the details to create a new task</p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <TaskForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
}
