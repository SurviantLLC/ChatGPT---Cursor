'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { Idea } from '@/lib/types';
import toast from 'react-hot-toast';
import { FaTags, FaUser, FaCalendar, FaThumbsUp, FaStar } from 'react-icons/fa';
import RatingInput from '@/components/ideas/RatingInput';

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    wouldUsePercentage: 0,
    averageRating: 0,
    totalInteractions: 0,
  });

  useEffect(() => {
    const fetchIdea = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;
        setUserId(currentUserId || null);
        
        // Fetch the idea
        const { data: ideaData, error: ideaError } = await supabase
          .from('ideas')
          .select('*, profiles:author_id(email)')
          .eq('id', params.id)
          .single();
        
        if (ideaError) {
          throw ideaError;
        }
        
        if (!ideaData) {
          toast.error('Idea not found');
          router.push('/');
          return;
        }
        
        // Map the data to our Idea type
        const idea: Idea = {
          ...ideaData,
          author_email: ideaData.profiles.email,
        };
        
        setIdea(idea);
        
        // Fetch idea statistics
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('interactions')
          .select('*')
          .eq('idea_id', params.id);
        
        if (interactionsError) {
          throw interactionsError;
        }
        
        if (interactionsData && interactionsData.length > 0) {
          // Calculate stats
          const totalInteractions = interactionsData.length;
          const wouldUseCount = interactionsData.filter(i => i.swipe === true).length;
          const wouldUsePercentage = Math.round((wouldUseCount / totalInteractions) * 100);
          
          const ratings = interactionsData
            .filter(i => i.rating !== null)
            .map(i => i.rating as number);
          
          const averageRating = ratings.length > 0
            ? parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1))
            : 0;
          
          setStats({
            wouldUsePercentage,
            averageRating,
            totalInteractions,
          });
        }
        
        // Check if the current user has already rated this idea
        if (currentUserId) {
          const { data: userInteraction } = await supabase
            .from('interactions')
            .select('rating')
            .eq('idea_id', params.id)
            .eq('user_id', currentUserId)
            .single();
          
          if (userInteraction) {
            setUserRating(userInteraction.rating);
          }
        }
      } catch (error) {
        console.error('Error fetching idea:', error);
        toast.error('Failed to load idea details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIdea();
  }, [params.id, router]);

  const handleRatingSubmit = async (rating: number) => {
    if (!userId || !idea) return;
    
    try {
      // Check if user has already interacted with this idea
      const { data: existingInteraction, error: fetchError } = await supabase
        .from('interactions')
        .select('id, rating, swipe')
        .eq('idea_id', idea.id)
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingInteraction) {
        // Update existing interaction
        const { error: updateError } = await supabase
          .from('interactions')
          .update({ rating })
          .eq('id', existingInteraction.id);
        
        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new interaction
        const { error: insertError } = await supabase
          .from('interactions')
          .insert({
            user_id: userId,
            idea_id: idea.id,
            rating,
            swipe: true, // Default to "would use" for direct ratings
          });
        
        if (insertError) {
          throw insertError;
        }
      }
      
      setUserRating(rating);
      toast.success('Rating submitted successfully!');
      
      // Refresh stats
      const { data: updatedInteractions } = await supabase
        .from('interactions')
        .select('*')
        .eq('idea_id', idea.id);
      
      if (updatedInteractions) {
        const totalInteractions = updatedInteractions.length;
        const wouldUseCount = updatedInteractions.filter(i => i.swipe === true).length;
        const wouldUsePercentage = Math.round((wouldUseCount / totalInteractions) * 100);
        
        const ratings = updatedInteractions
          .filter(i => i.rating !== null)
          .map(i => i.rating as number);
        
        const averageRating = ratings.length > 0
          ? parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1))
          : 0;
        
        setStats({
          wouldUsePercentage,
          averageRating,
          totalInteractions,
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading idea details...</p>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Idea Not Found</h2>
        <p className="text-gray-600 mb-4">
          The idea you're looking for might have been removed or doesn't exist.
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn btn-primary mx-auto"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-primary-600 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
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
      
      <div className="card overflow-hidden">
        {idea.image_path && (
          <div className="h-64 md:h-96 relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ideas/${idea.image_path}`}
              alt={idea.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
          
          <div className="flex flex-wrap gap-y-4 mb-6 text-sm text-gray-500">
            <div className="flex items-center mr-6">
              <FaUser className="mr-2" />
              <span>{idea.author_email || 'Anonymous'}</span>
            </div>
            <div className="flex items-center mr-6">
              <FaCalendar className="mr-2" />
              <span>{new Date(idea.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mr-6">
              <FaThumbsUp className="mr-2 text-green-500" />
              <span>{stats.wouldUsePercentage}% would use</span>
            </div>
            <div className="flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              <span>Rating: {stats.averageRating} / 10</span>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-700 whitespace-pre-line">{idea.description}</p>
          </div>
          
          {idea.tags && idea.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <FaTags className="text-gray-500 mr-2" />
                <span className="text-gray-500 font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-bold mb-4">Rate this idea</h2>
            
            {userId ? (
              <div className="max-w-md">
                <p className="text-gray-600 mb-4">
                  Your rating helps entrepreneurs understand the market potential of their ideas.
                </p>
                
                <RatingInput 
                  value={userRating} 
                  onChange={handleRatingSubmit}
                />
                
                <p className="text-sm text-gray-500 mt-2">
                  {userRating 
                    ? 'Your rating has been recorded. You can update it at any time.' 
                    : 'Click on a star to submit your rating.'}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  <a href="/login" className="text-primary-600 hover:underline">Sign in</a> to rate this idea.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
