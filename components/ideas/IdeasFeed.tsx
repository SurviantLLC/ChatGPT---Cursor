'use client';

import { useEffect, useState, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Idea } from '@/lib/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaTags, FaThumbsUp, FaThumbsDown, FaStar, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';
import RatingInput from './RatingInput';
import Link from 'next/link';

type IdeasFeedProps = {
  ideas: Idea[];
  isLoading: boolean;
  onInteraction: (userId: string) => void;
};

export default function IdeasFeed({ ideas, isLoading, onInteraction }: IdeasFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [swiped, setSwiped] = useState<boolean>(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // For card references - using any type to resolve tinder-card API compatibility issues
  const cardRefs = useRef<any[]>([]);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [ideas]);

  const handleSwipe = async (direction: string, idea: Idea) => {
    if (!userId) return;
    
    // Update animation state
    setLastDirection(direction);
    setSwiped(true);
    setSwipeDirection(direction as 'left' | 'right');
    
    const swipeValue = direction === 'right';
    
    try {
      // Record the swipe interaction
      const { error } = await supabase.from('interactions').insert({
        user_id: userId,
        idea_id: idea.id,
        swipe: swipeValue,
        rating: rating,
      });
      
      if (error) {
        throw error;
      }
      
      // Use a more visually appealing toast notification
      if (swipeValue) {
        toast.success(
          <div className="flex items-center space-x-2">
            <FaThumbsUp className="text-green-500" />
            <span>Great choice! You'd use this idea.</span>
          </div>
        );
      } else {
        toast(
          <div className="flex items-center space-x-2">
            <FaThumbsDown className="text-red-500" />
            <span>Not for you! You wouldn't use this.</span>
          </div>,
          { icon: '👎' }
        );
      }
      
      // Move to the next card with a slight delay for animation
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setRating(null);
        setSwiped(false);
        
        // If all cards have been swiped, refresh the feed
        if (currentIndex >= ideas.length - 1) {
          onInteraction(userId);
        }
      }, 300);
    } catch (error: any) {
      toast.error('Failed to record your interaction');
      console.error(error);
      setSwiped(false); // Reset swiped state on error
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  // Function to manually trigger a swipe
  const swipe = (dir: 'left' | 'right') => {
    if (currentIndex < ideas.length && cardRefs.current[currentIndex]) {
      cardRefs.current[currentIndex].swipe(dir);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaLightbulb className="h-10 w-10 text-primary-500" />
            </div>
          </div>
          <p className="text-xl font-medium text-gray-700">Discovering brilliant ideas...</p>
          <p className="text-gray-500 mt-2">Finding the next big thing just for you</p>
        </motion.div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-8 text-center max-w-lg mx-auto shadow-lg border border-gray-200"
      >
        <div className="rounded-full bg-gray-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FaLightbulb className="h-8 w-8 text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">No More Ideas</h2>
        <p className="text-gray-600 mb-6">
          You've gone through all available ideas! Check back later for new submissions or create your own innovative idea.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onInteraction(userId as string)}
            className="btn btn-primary"
          >
            Refresh Ideas
          </motion.button>
          <Link href="/ideas/new" className="btn btn-outline">
            Submit New Idea
          </Link>
        </div>
      </motion.div>
    );
  }

  // Calculate date display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="relative min-h-[600px] w-full max-w-md mx-auto">
      <AnimatePresence>
        {/* Swipe buttons */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-8 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => swipe('left')}
            disabled={ideas.length === 0 || currentIndex >= ideas.length}
          >
            <FaThumbsDown size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border border-green-100 text-green-500 hover:bg-green-50 transition-colors"
            onClick={() => swipe('right')}
            disabled={ideas.length === 0 || currentIndex >= ideas.length}
          >
            <FaThumbsUp size={20} />
          </motion.button>
        </div>

        {/* Cards */}
        {ideas.map((idea, index) => {
          // Don't render cards that have already been swiped or are too far ahead in the stack
          if (index < currentIndex || index >= currentIndex + 3) return null;
          
          return (
            <TinderCard
              ref={(element: any) => cardRefs.current[index] = element}
              key={idea.id}
              onSwipe={(dir) => handleSwipe(dir, idea)}
              preventSwipe={['up', 'down']}
              className="absolute w-full h-full"
            >
              <motion.div 
                className="idea-card w-full h-full flex flex-col overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{
                  transform: swiped && currentIndex === index ? 
                    `translate(${swipeDirection === 'left' ? '-100px' : '100px'}, 0) rotate(${swipeDirection === 'left' ? '-10deg' : '10deg'})` : 
                    'none'
                }}
              >
                {idea.image_path ? (
                  <div className="h-48 relative bg-gray-100 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ideas/${idea.image_path}`}
                      alt={idea.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority={index === currentIndex}
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-xl transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-t-xl flex items-center justify-center">
                    <FaLightbulb className="text-primary-400 h-16 w-16 opacity-75" />
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col bg-white rounded-b-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{idea.title}</h2>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" size={12} />
                      <span>{formatDate(idea.created_at)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 flex-1 leading-relaxed">
                    {idea.description.length > 180
                      ? `${idea.description.substring(0, 180)}...`
                      : idea.description}
                  </p>
                  
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center mb-2">
                        <FaTags className="text-gray-500 mr-2" size={14} />
                        <span className="text-sm font-medium text-gray-700">Categories</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="bg-primary-50 px-3 py-1 rounded-full text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <div className="flex justify-between mb-5 rounded-lg bg-gray-50 p-3">
                      <div className="flex flex-col items-center">
                        <div className="text-red-500 mb-1">
                          <FaThumbsDown size={18} />
                        </div>
                        <span className="text-xs text-gray-500">Swipe left</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-green-500 mb-1">
                          <FaThumbsUp size={18} />
                        </div>
                        <span className="text-xs text-gray-500">Swipe right</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center mb-3">
                        <FaStar className="text-yellow-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Rate this idea (1-10):</span>
                      </div>
                      
                      <RatingInput value={rating} onChange={handleRatingChange} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TinderCard>
          );
        })}

        {/* Swipe guidance animation */}
        {ideas.length > 0 && currentIndex < ideas.length && !swiped && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatDelay: 1
            }}
          >
            <div className="relative w-40 h-40">
              <motion.div
                className="absolute inset-0 border-2 border-primary-300 rounded-full"
                animate={{ 
                  x: [0, 80, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatDelay: 1
                }}
              />
              <motion.div
                className="absolute top-1/2 right-0 transform -translate-y-1/2"
                animate={{ 
                  x: [0, 30, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatDelay: 1
                }}
              >
                <FaThumbsUp className="text-primary-400 h-8 w-8" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {ideas.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{currentIndex} of {ideas.length} viewed</span>
            <span>{Math.max(0, ideas.length - currentIndex)} remaining</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / ideas.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
