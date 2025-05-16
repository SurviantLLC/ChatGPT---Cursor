'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Idea } from '@/lib/types';
import { FaPlus, FaUser, FaThumbsUp, FaStar } from 'react-icons/fa';

export default function ProfilePage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/login');
        return;
      }
      
      setUserId(data.session.user.id);
      setUserEmail(data.session.user.email || null);
      fetchUserIdeas(data.session.user.id);
    };
    
    checkAuth();
  }, [router]);

  const fetchUserIdeas = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Fetch ideas created by the user
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });
      
      if (ideasError) {
        throw ideasError;
      }
      
      if (ideasData) {
        // For each idea, fetch its stats
        const ideasWithStats = await Promise.all(
          ideasData.map(async (idea) => {
            const { data: interactionsData } = await supabase
              .from('interactions')
              .select('*')
              .eq('idea_id', idea.id);
            
            let wouldUsePercentage = 0;
            let averageRating = 0;
            
            if (interactionsData && interactionsData.length > 0) {
              const wouldUseCount = interactionsData.filter(i => i.swipe === true).length;
              wouldUsePercentage = Math.round((wouldUseCount / interactionsData.length) * 100);
              
              const ratings = interactionsData
                .filter(i => i.rating !== null)
                .map(i => i.rating as number);
              
              averageRating = ratings.length > 0
                ? parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1))
                : 0;
            }
            
            return {
              ...idea,
              would_use_percentage: wouldUsePercentage,
              average_rating: averageRating,
            };
          })
        );
        
        setIdeas(ideasWithStats);
      }
    } catch (error) {
      console.error('Error fetching user ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link href="/ideas/new" className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" />
          New Idea
        </Link>
      </div>
      
      <div className="card p-6 mb-8">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-full p-4 mr-4">
            <FaUser size={32} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userEmail}</h2>
            <p className="text-gray-600">Member since {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">My Ideas</h2>
      
      {ideas.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't created any ideas yet.</p>
          <Link href="/ideas/new" className="btn btn-primary">
            Create Your First Idea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="card overflow-hidden">
              {idea.image_path && (
                <div className="h-48 relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ideas/${idea.image_path}`}
                    alt={idea.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {idea.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="border-t pt-3 flex justify-between">
                  <div className="flex items-center text-sm">
                    <FaThumbsUp className="text-green-500 mr-1" />
                    <span>{idea.would_use_percentage || 0}% would use</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span>Rating: {idea.average_rating || 0}/10</span>
                  </div>
                </div>
                
                <Link
                  href={`/ideas/${idea.id}`}
                  className="mt-4 btn btn-outline w-full"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
