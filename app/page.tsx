'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Idea } from '@/lib/types';
import IdeasFeed from '@/components/ideas/IdeasFeed';
import LoginPrompt from '@/components/auth/LoginPrompt';

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication status...');
      const { data } = await supabase.auth.getSession();
      
      const isAuthenticated = !!data.session;
      console.log('Is authenticated:', isAuthenticated);
      setIsLoggedIn(isAuthenticated);
      
      if (data.session) {
        console.log('User authenticated, ID:', data.session.user.id);
        loadIdeas(data.session.user.id);
      } else {
        console.log('User not authenticated');
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      const isAuthenticated = !!session;
      setIsLoggedIn(isAuthenticated);
      
      if (session) {
        console.log('User authenticated via listener, ID:', session.user.id);
        loadIdeas(session.user.id);
      } else {
        console.log('User not authenticated via listener');
        setIsLoading(false);
      }
    });
    
    return () => {
      console.log('Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // This function is used both internally and passed to IdeasFeed component
  const loadIdeas = async (userId: string) => {
    console.log('Loading ideas for user:', userId);
    setIsLoading(true);
    try {
      // Fetch ideas that the user hasn't interacted with yet
      // Using a different approach to avoid the TypeScript error
      const { data: allIdeas, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (ideasError) {
        throw ideasError;
      }

      // Fetch all interactions for this user
      const { data: userInteractions, error: interactionsError } = await supabase
        .from('interactions')
        .select('idea_id')
        .eq('user_id', userId);

      if (interactionsError) {
        throw interactionsError;
      }

      // Filter out ideas the user has already interacted with
      const interactedIdeaIds = userInteractions?.map(interaction => interaction.idea_id) || [];
      const data = allIdeas?.filter(idea => !interactedIdeaIds.includes(idea.id)) || [];
      
      // We've already checked for errors above, but we'll log the filtered results
      
      console.log(`Loaded ${data?.length || 0} ideas`);
      setIdeas(data || []);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Discover Startup Ideas</h1>
      
      {isLoggedIn ? (
        <IdeasFeed ideas={ideas} isLoading={isLoading} onInteraction={loadIdeas} />
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
