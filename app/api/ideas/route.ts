import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    let query = supabase.from('ideas').select('*');
    
    // If userId is provided, only fetch ideas not interacted with by the user
    if (userId) {
      const { data: interactions } = await supabase
        .from('interactions')
        .select('idea_id')
        .eq('user_id', userId);
      
      const interactedIdeaIds = interactions?.map(i => i.idea_id) || [];
      
      if (interactedIdeaIds.length > 0) {
        query = query.not('id', 'in', `(${interactedIdeaIds.join(',')})`);
      }
    }
    
    // Execute the query and order by creation date (newest first)
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, tags, author_id, image_path } = await request.json();
    
    if (!title || !description || !tags || !author_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.from('ideas').insert({
      title,
      description,
      tags,
      author_id,
      image_path: image_path || null,
    }).select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
