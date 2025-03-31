'use client';

import { ProductProps } from '@/hooks/useProduct';
import Link from 'next/link';
import { useState } from 'react';

interface TaskCardProps {
  task: ProductProps;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export default function TaskCard({ task, onDelete, onToggleComplete }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task._id as string);
      } catch (error) {
        console.error('Failed to delete task', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  /**
   * Toggles the completion status of a task between complete and incomplete.
   * When the task is currently marked as complete, toggling will explicitly revert
   * it to an incomplete state. Conversely, toggling an incomplete task will mark it as complete.
   */
  const handleToggleComplete = async () => {
    // Explicitly set the target state for better semantic clarity
    const newCompletedState = !task.completed;
    const actionType = newCompletedState ? 'complete' : 'uncomplete';

    setIsTogglingComplete(true);
    try {
      await onToggleComplete(task._id as string, newCompletedState);
      // Optional: You could add toast notifications here
      // toast.success(`Task ${actionType}d successfully`);
    } catch (error) {
      console.error(`Failed to ${actionType} task`, error);
      // Optional: Add user-facing error notification
      // toast.error(`Failed to ${actionType} task. Please try again.`);
    } finally {
      setIsTogglingComplete(false);
    }
  };

  // Determine priority color class
  const priorityColorClass =
    {
      low: 'bg-priority-low',
      medium: 'bg-priority-medium',
      high: 'bg-priority-high',
    }[task.priority] || 'bg-gray-500';

  // Format date for better readability
  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return '';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Create date for display
  const createdDate = formatDate(task.metadata?.created_at);

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all  hover:translate-y-[-2px] duration-300">
      {/* Card Header with Priority Indicator */}
      <div className="relative overflow-hidden">
        <div className={`${priorityColorClass} h-1.5 w-full`} aria-hidden="true"></div>
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold truncate text-gray-800">{task.title}</h3>
            <div className="flex items-center space-x-2">
              {/* <span
                className={`${priorityColorClass}  text-sm font-medium px-3 py-1 rounded-full bg-black/70 text-white`}
              >
                {task.priority}
              </span> */}
              <label
                className="relative inline-flex items-center cursor-pointer"
                title={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={handleToggleComplete}
                  disabled={isTogglingComplete}
                  className="sr-only peer"
                  aria-label={`Mark task ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <div
                  className={`w-10 h-5 ${
                    isTogglingComplete ? 'opacity-60' : ''
                  } bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600`}
                  data-testid={`toggle-complete-${task._id}`}
                  role="presentation"
                >
                  {isTogglingComplete && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-3 h-3 border-t-2 border-blue-400 border-solid rounded-full animate-spin"></span>
                    </span>
                  )}
                </div>
                <span className="ml-2 text-xs text-gray-600 font-medium">
                  {task.completed ? 'Completed' : 'Incomplete'}
                </span>
                <span className="sr-only">
                  {task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                </span>
              </label>
            </div>
          </div>

          {/* Description with proper formatting */}
          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{task.description}</p>

          {/* Tags with improved styling */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded border border-blue-100 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Date and metadata section */}
          {createdDate && (
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Created: {createdDate}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer with Actions */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
        <Link
          href={`/tasks/${task._id}`}
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            <path
              fillRule="evenodd"
              d="M3.46 10A6.54 6.54 0 0110 3.46 6.54 6.54 0 0116.54 10a6.54 6.54 0 01-6.54 6.54A6.54 6.54 0 013.46 10zm1.5 0a5.04 5.04 0 005.04 5.04A5.04 5.04 0 0015.04 10 5.04 5.04 0 0010 4.96 5.04 5.04 0 004.96 10z"
              clipRule="evenodd"
            />
          </svg>
          View Details
        </Link>
        <div className="flex space-x-2">
          <Link
            href={`/tasks/${task._id}/edit`}
            className="px-3 py-1.5 bg-black  text-white text-sm rounded-md hover:bg-black/90  transition-colors focus:outline-none focus:ring-2  focus:ring-offset-2 font-medium inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium inline-flex items-center"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
