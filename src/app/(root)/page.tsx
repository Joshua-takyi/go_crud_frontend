'use client';

import useProduct, { ProductProps } from '@/hooks/useProduct';
import React, { useState } from 'react';
import TaskCard from '@/components/task/TaskCard';
import Link from 'next/link';

const Home = () => {
  const { getAllProducts, deleteProduct, toggleCompleteStatus } = useProduct();
  const { data: tasks, isLoading, error } = getAllProducts;
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await toggleCompleteStatus.mutateAsync({ id, completed });
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  // Filter tasks based on completion status and priority
  const filteredTasks = React.useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];

    return tasks.filter((task: ProductProps) => {
      const statusMatch =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'active' && !task.completed);

      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });
  }, [tasks, filter, priorityFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="mt-1 text-sm text-gray-500">
              Organize, track, and manage your tasks efficiently
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/tasks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Task
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="h-5 w-5 text-red-400" aria-hidden="true">
                  ⚠️
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="bg-white shadow rounded-lg mb-8 p-4 sm:p-6">
              <div className="sm:flex sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <div className="flex space-x-1">
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        filter === 'all'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setFilter('all')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        filter === 'active'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setFilter('active')}
                    >
                      Active
                    </button>
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        filter === 'completed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setFilter('completed')}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) =>
                      setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')
                    }
                    className="rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-600">No tasks found</p>
                <p className="mt-1 text-sm text-gray-500">
                  {tasks && Array.isArray(tasks) && tasks.length > 0
                    ? 'Try changing your filters to see more results'
                    : 'Start by creating your first task'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task: ProductProps) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
