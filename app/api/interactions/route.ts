import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { user_id, idea_id, swipe, rating } = await request.json();
    
    if (!user_id || !idea_id || swipe === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if the user has already interacted with this idea
    const { data: existingInteraction } = await supabase
      .from('interactions')
      .select('id')
      .eq('user_id', user_id)
      .eq('idea_id', idea_id)
      .single();
    
    if (existingInteraction) {
      // Update the existing interaction
      const { data, error } = await supabase
        .from('interactions')
        .update({
          swipe,
          rating: rating || null,
        })
        .eq('id', existingInteraction.id)
        .select();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data[0]);
    } else {
      // Create a new interaction
      const { data, error } = await supabase
        .from('interactions')
        .insert({
          user_id,
          idea_id,
          swipe,
          rating: rating || null,
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data[0]);
    }
  } catch (error) {
    console.error('Error creating/updating interaction:', error);
    return NextResponse.json(
      { error: 'Failed to record interaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ideaId = url.searchParams.get('ideaId');
    const userId = url.searchParams.get('userId');
    
    if (!ideaId) {
      return NextResponse.json(
        { error: 'Idea ID is required' },
        { status: 400 }
      );
    }
    
    let query = supabase.from('interactions').select('*');
    
    // Filter by idea ID
    query = query.eq('idea_id', ideaId);
    
    // If user ID is provided, filter by user as well
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    if (userId) {
      // If looking for a specific user's interaction, return the single result
      return NextResponse.json(data[0] || null);
    } else {
      // Calculate statistics for the idea
      const totalInteractions = data.length;
      const wouldUseCount = data.filter(i => i.swipe === true).length;
      const wouldUsePercentage = totalInteractions > 0
        ? Math.round((wouldUseCount / totalInteractions) * 100)
        : 0;
      
      const ratings = data
        .filter(i => i.rating !== null)
        .map(i => i.rating);
      
      const averageRating = ratings.length > 0
        ? parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1))
        : 0;
      
      return NextResponse.json({
        total_interactions: totalInteractions,
        would_use_percentage: wouldUsePercentage,
        average_rating: averageRating,
        interactions: data,
      });
    }
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}
