'use client';

import useProduct, { ProductProps } from '@/hooks/useProduct';
import React, { useState } from 'react';
import TaskCard from '@/components/task/TaskCard';
import Link from 'next/link';

const Home = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const { useAllProducts, deleteProduct, toggleCompleteStatus } = useProduct();
  const { data, isLoading, error } = useAllProducts(currentPage, itemsPerPage);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Extract tasks and pagination info from the response
  const tasks = data?.tasks || [];
  const pagination = data?.pagination;

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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of the page for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers array for pagination controls
  const getPageNumbers = () => {
    if (!pagination) return [];

    const totalPages = pagination.totalPages;
    const currentPageNum = pagination.page;

    // Show a limited number of page buttons to avoid cluttering the UI
    let startPage = Math.max(1, currentPageNum - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Create pagination controls JSX
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();

    return (
      <div className="flex items-center justify-center my-8">
        <nav
          className="relative z-0 inline-flex shadow-sm rounded-md -space-x-px"
          aria-label="Pagination"
        >
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* First page button (if not in the first few pages) */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
            </>
          )}

          {/* Page number buttons */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page button (if not in the last few pages) */}
          {pageNumbers[pageNumbers.length - 1] < pagination.totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < pagination.totalPages - 1 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {pagination.totalPages}
              </button>
            </>
          )}

          {/* Next page button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasMore}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
              !pagination.hasMore
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    );
  };

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

            {/* Pagination controls */}
            {renderPagination()}

            {/* Pagination information */}
            {pagination && (
              <div className="text-sm text-center text-gray-600 mt-4">
                Showing {filteredTasks.length} of {pagination.total} tasks
                {pagination.totalPages > 1 &&
                  ` | Page ${pagination.page} of ${pagination.totalPages}`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
