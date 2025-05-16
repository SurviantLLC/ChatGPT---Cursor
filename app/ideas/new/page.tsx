'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { FaUpload, FaTimesCircle, FaTag } from 'react-icons/fa';
import Image from 'next/image';

type IdeaFormValues = {
  title: string;
  description: string;
  tags: string;
};

export default function NewIdeaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdeaFormValues>();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  const onSubmit = async (data: IdeaFormValues) => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create an idea');
        router.push('/login');
        return;
      }
      
      let imagePath = null;
      
      // Upload image if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('ideas')
          .upload(filePath, image);
        
        if (uploadError) {
          throw new Error('Failed to upload image');
        }
        
        imagePath = filePath;
      }
      
      // Parse tags
      const tags = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Insert idea into database
      const { error } = await supabase.from('ideas').insert({
        title: data.title,
        description: data.description,
        image_path: imagePath,
        tags,
        author_id: user.id,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Idea submitted successfully!');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit idea');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submit a New Idea</h1>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              className="form-input"
              placeholder="Enter a catchy title for your idea"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters',
                },
              })}
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              className="form-input"
              placeholder="Describe your idea in detail..."
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description should be at least 20 characters',
                },
              })}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="form-label flex items-center">
              <FaTag className="mr-2 text-gray-500" />
              Tags (comma separated)
            </label>
            <input
              id="tags"
              className="form-input"
              placeholder="e.g., fintech, mobile, saas, health"
              {...register('tags', {
                required: 'At least one tag is required',
              })}
            />
            {errors.tags && (
              <p className="form-error">{errors.tags.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Add relevant tags to help others discover your idea
            </p>
          </div>
          
          <div>
            <label htmlFor="image" className="form-label">
              Image (optional)
            </label>
            
            {!imagePreview ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload an image</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-2 relative">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <FaTimesCircle />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
