export type User = {
  id: string;
  email: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  image_path: string | null;
  tags: string[];
  author_id: string;
  created_at: string;
  author_email?: string;
  would_use_percentage?: number;
  average_rating?: number;
};

export type Interaction = {
  id: string;
  user_id: string;
  idea_id: string;
  swipe: boolean;
  rating: number | null;
  created_at: string;
};

export type IdeaWithStats = Idea & {
  would_use_percentage: number;
  average_rating: number;
  interactions_count: number;
};
