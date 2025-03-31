'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useProduct, { ProductFormData } from '@/hooks/useProduct';
import TaskForm from '@/components/task/TaskForm';

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  const taskId = resolvedParams.id;

  const router = useRouter();
  const { useProductById, updateProduct } = useProduct();
  const { data: task, isLoading: isLoadingTask, error: fetchError } = useProductById(taskId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await updateProduct.mutateAsync({
        id: taskId,
        data: formData,
      });
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !task) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600 mb-4">
              {fetchError instanceof Error ? fetchError.message : 'Task not found'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
            <p className="mt-1 text-sm text-gray-500">Update the details of your task</p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <TaskForm initialData={task} onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
}
