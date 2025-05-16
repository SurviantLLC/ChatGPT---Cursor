# Startup Idea Hub

A platform for discovering, rating, and sharing innovative startup ideas built with Next.js, Tailwind CSS, and Supabase.

## Features

- **User accounts**: Sign up, log in, log out with Supabase Auth
- **Idea posts**: Each idea has a title, description, optional image upload, and tags
- **Swipeable feed**: Swipe left/right to indicate interest in startup ideas
- **Rating system**: Rate ideas on a scale of 1-10
- **Profile page**: View and manage your submitted ideas and see their performance

## Tech Stack

- **Frontend & API**: Next.js (React) + Tailwind CSS
- **Backend-as-a-Service**: Supabase
  - Auth: email/password via Supabase Auth
  - Database: PostgreSQL (via Supabase)
  - Storage: Supabase Storage for image uploads

## Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn
- A Supabase account (free tier is sufficient)

### Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd startup-idea-hub
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up Supabase**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Once your project is created, go to the project settings to find your API URL and anon key
   - Create a `.env.local` file in the root of your project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Set up the Supabase database**

Run the following SQL in the Supabase SQL editor to create the required tables:

```sql
-- Create tables and setup relationships
-- Note: auth.users table is created automatically by Supabase Auth

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  swipe BOOLEAN NOT NULL,
  rating SMALLINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- A user can only have one interaction with an idea
  CONSTRAINT unique_user_idea UNIQUE (user_id, idea_id),
  -- Rating must be between 1 and 10
  CONSTRAINT valid_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10))
);

-- Create storage bucket for idea images
INSERT INTO storage.buckets (id, name, public) VALUES ('ideas', 'ideas', true);

-- Set up RLS (Row Level Security) policies for tables

-- Ideas RLS policies
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Everyone can read ideas
CREATE POLICY "Anyone can read ideas"
  ON ideas FOR SELECT
  USING (true);

-- Only authenticated users can insert ideas, and they can only set themselves as the author
CREATE POLICY "Authenticated users can create ideas"
  ON ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own ideas
CREATE POLICY "Authors can update their own ideas"
  ON ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own ideas
CREATE POLICY "Authors can delete their own ideas"
  ON ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Interactions RLS policies
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Users can read all interactions
CREATE POLICY "Anyone can read interactions"
  ON interactions FOR SELECT
  USING (true);

-- Users can only create/update interactions for themselves
CREATE POLICY "Users can create their own interactions"
  ON interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
  ON interactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own interactions
CREATE POLICY "Users can delete their own interactions"
  ON interactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Set up storage policies
CREATE POLICY "Anyone can read idea images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ideas');

CREATE POLICY "Authenticated users can upload idea images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ideas' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own idea images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'ideas' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own idea images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'ideas' AND (storage.foldername(name))[1] = auth.uid()::text);
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Vercel Deployment (Recommended)

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com) and sign up or log in
3. Click on "Add New" → "Project"
4. Import your Git repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Environment Variables**: Add your Supabase environment variables
     - `NEXT_PUBLIC_SUPABASE_URL` 
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

The deployed site will automatically update whenever you push changes to your repository.

### Production Optimizations

This project includes a `vercel.json` configuration file with:
- Security headers
- Region configuration
- Redirects and rewrites
- Build and install commands

The `next.config.js` file is also configured to properly handle Supabase image domains and optimize performance.

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/             # Authentication routes
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── api/                # API routes
│   │   ├── ideas/          # Ideas API
│   │   └── interactions/   # Interactions API
│   ├── ideas/              # Ideas pages
│   │   ├── [id]/           # Idea detail page
│   │   └── new/            # New idea creation page
│   ├── profile/            # User profile page
│   └── page.tsx            # Home page with idea feed
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── ideas/              # Idea-related components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions and types
│   └── supabase/           # Supabase client and types
├── public/                 # Static assets
├── .env.example            # Example environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## License

This project is licensed under the MIT License.
