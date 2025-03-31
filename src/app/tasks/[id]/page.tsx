'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import useProduct from '@/hooks/useProduct';
import Link from 'next/link';
import Image from 'next/image';

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  const taskId = resolvedParams.id;

  const router = useRouter();
  const { useProductById, deleteProduct, toggleCompleteStatus } = useProduct();
  const { data: task, isLoading, error } = useProductById(taskId);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteProduct.mutateAsync(taskId);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete task', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleToggleComplete = async () => {
    try {
      await toggleCompleteStatus.mutateAsync({
        id: taskId,
        completed: !task?.completed,
      });
    } catch (error) {
      console.error('Failed to update task status', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600 mb-4">
              {error instanceof Error ? error.message : 'Task not found'}
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

  // Determine priority color class
  const priorityColorClass =
    {
      low: 'bg-priority-low',
      medium: 'bg-priority-medium',
      high: 'bg-priority-high',
    }[task.priority as 'low' | 'medium' | 'high'] || 'bg-gray-500';

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
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
              <p className="mt-1 text-sm text-gray-500">Detailed information about this task</p>
            </div>
            {/* badge */}
            <span
              className={`${priorityColorClass}  text-sm font-medium px-3 py-1 rounded-full bg-black/70 text-white`}
            >
              {task.priority}
            </span>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    Created: {new Date(task.metadata.createdAt || '').toLocaleString()}
                  </span>
                  {task.metadata.updatedAt && (
                    <span className="text-xs text-gray-500 ml-2">
                      Updated: {new Date(task.metadata.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {task.description}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {task.image && task.image.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Images</h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {task.image.map((img: string, index: number) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden bg-gray-100 group"
                      >
                        <Image
                          width={300}
                          height={200}
                          src={img}
                          alt={`Task image ${index + 1}`}
                          className="h-48 w-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                          <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-white text-gray-900 rounded-md text-sm hover:bg-gray-100"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div>
                <button
                  onClick={handleToggleComplete}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                    task.completed
                      ? 'text-white bg-yellow-600 hover:bg-yellow-700'
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/tasks/${taskId}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
