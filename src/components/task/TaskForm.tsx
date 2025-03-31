'use client';

import { ProductFormData, ProductProps } from '@/hooks/useProduct';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

interface TaskFormProps {
  initialData?: ProductProps;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

export default function TaskForm({ initialData, onSubmit, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    priority: initialData?.priority || 'medium',
    image: initialData?.image || [],
    completed: initialData?.completed || false,
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'completed' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        image: [...(prev.image || []), imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image?.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.tags.length) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Completed Field */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
            Mark as completed
          </label>
        </div>

        {/* Tags Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          {errors.tags && <p className="mt-1 text-sm text-red-500">{errors.tags}</p>}

          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span className="text-gray-800">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs)</label>
          <div className="flex">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add an image URL"
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {formData.image?.map((img, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center overflow-hidden">
                  <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden mr-2 flex-shrink-0">
                    <Image
                      width={100}
                      height={100}
                      src={img}
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== 'https://via.placeholder.com/100?text=Error') {
                          target.src = 'https://via.placeholder.com/100?text=Error';
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm truncate flex-1">{img}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
