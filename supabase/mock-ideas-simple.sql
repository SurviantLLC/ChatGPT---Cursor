-- This is a simplified version of the mock ideas script that doesn't use the tags column

DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the first user ID from the auth.users table
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'No users found in the auth.users table. Please create a user first.';
  END IF;
  
  RAISE NOTICE 'Using user_id: %', user_id;

-- Insert mock ideas (without tags)
INSERT INTO ideas (title, description, author_id, created_at)
VALUES
  (
    'EcoTrack',
    'A mobile app that helps users track their carbon footprint through daily activities and offers personalized suggestions to reduce environmental impact. Features include transportation emissions calculator, household energy usage tracking, and community challenges.',
    user_id,
    NOW() - INTERVAL '1 day'
  ),
  (
    'MindfulMinutes',
    'An AI-powered meditation platform that adapts sessions based on your mood, stress levels, and available time. The app uses speech analysis and optional heart rate data to customize meditation experiences in real-time.',
    user_id,
    NOW() - INTERVAL '2 days'
  ),
  (
    'LocalEats Collective',
    'A platform connecting local farms directly to consumers through a subscription model. Users get weekly boxes of seasonal produce, and the platform handles logistics while providing transparency about where food comes from and supporting small-scale agriculture.',
    user_id,
    NOW() - INTERVAL '3 days'
  ),
  (
    'CodeBuddy AI',
    'An AI pair programming assistant that integrates with all major IDEs. Beyond just code suggestions, it explains concepts, reviews code quality, suggests refactoring, and helps developers learn while coding by explaining its suggestions in educational terms.',
    user_id,
    NOW() - INTERVAL '4 days'
  ),
  (
    'SeniorConnect',
    'A simplified communication platform designed specifically for seniors to stay connected with family members. Features include large text interfaces, voice commands, photo sharing, automated check-ins, and emergency alerts.',
    user_id,
    NOW() - INTERVAL '5 days'
  ),
  (
    'SkillSwap',
    'A platform where users can exchange skills and knowledge without money changing hands. The time-banking system allows users to teach what they know and learn what they want based on time credits rather than financial payments.',
    user_id,
    NOW() - INTERVAL '6 days'
  ),
  (
    'NutriScan',
    'A mobile app that scans food products and provides personalized nutritional insights based on your dietary goals, restrictions, and health conditions. The app offers alternatives when products don''t meet your criteria.',
    user_id,
    NOW() - INTERVAL '7 days'
  ),
  (
    'RentalRights',
    'A platform helping renters understand their legal rights and navigate disputes with landlords. The service provides document templates, automated communications, and affordable access to tenant lawyers when needed.',
    user_id,
    NOW() - INTERVAL '8 days'
  ),
  (
    'WasteNoMore',
    'An AI-powered smart trash bin that automatically sorts recyclables, compostables, and landfill waste. The system includes a mobile app that tracks your waste reduction progress and environmental impact.',
    user_id,
    NOW() - INTERVAL '9 days'
  ),
  (
    'MicroLearn',
    'A platform offering 5-minute micro-learning courses designed to be completed during small breaks throughout the day. Courses span professional skills, personal development, and specialized knowledge, optimized for retention through spaced repetition.',
    user_id,
    NOW() - INTERVAL '10 days'
  ),
  (
    'PetPals',
    'A neighborhood pet-sitting exchange platform where pet owners can trade pet care services with trusted neighbors. The platform includes verification, pet health profiles, and an emergency backup system.',
    user_id,
    NOW() - INTERVAL '11 days'
  ),
  (
    'RetroFit',
    'A service that retrofits existing home appliances with smart capabilities at a fraction of the cost of buying new smart appliances. The solution includes easy-to-install adapters and a unified control app.',
    user_id,
    NOW() - INTERVAL '12 days'
  ),
  (
    'CreatorCoin',
    'A platform allowing content creators to launch their own social tokens that fans can purchase to access exclusive content, experiences, and community benefits. The system includes tools for creators to manage their token economy.',
    user_id,
    NOW() - INTERVAL '13 days'
  ),
  (
    'UrbanGrow',
    'Modular, stackable indoor gardening system designed for small urban apartments. The system is soil-less, automated, and allows you to grow vegetables, herbs, and small fruits year-round with minimal maintenance.',
    user_id,
    NOW() - INTERVAL '14 days'
  ),
  (
    'TravelBuddy',
    'An AI travel assistant that creates personalized itineraries based on your interests, budget, and travel style. The platform continually adapts recommendations based on your feedback and changing circumstances like weather or local events.',
    user_id,
    NOW() - INTERVAL '15 days'
  ),
  (
    'SecondChance',
    'A marketplace for refurbished electronics with extended warranties and quality guarantees. The platform handles testing, certification, and provides transparent history of device usage and repairs.',
    user_id,
    NOW() - INTERVAL '16 days'
  ),
  (
    'SoloWorker',
    'A comprehensive platform for freelancers and solopreneurs that bundles accounting, client management, insurance, retirement planning, and tax preparation into one affordable monthly subscription.',
    user_id,
    NOW() - INTERVAL '17 days'
  ),
  (
    'VirtualFitClub',
    'A VR fitness platform offering immersive group workout classes from anywhere in the world. Classes combine gamification elements with real trainer feedback and social accountability to keep users motivated.',
    user_id,
    NOW() - INTERVAL '18 days'
  ),
  (
    'CommunityPower',
    'A platform enabling neighborhoods to create local renewable energy microgrids, where residents can invest in, share, and trade energy. The system handles billing, maintenance coordination, and regulatory compliance.',
    user_id,
    NOW() - INTERVAL '19 days'
  ),
  (
    'KidFinance',
    'A financial literacy app for children that pairs with a parents-managed debit card. The app gamifies saving, charitable giving, and smart spending while teaching age-appropriate financial concepts.',
    user_id,
    NOW() - INTERVAL '20 days'
  ),
  (
    'AccessibleDesign',
    'A platform connecting businesses with accessibility consultants to make physical spaces and digital products more inclusive. The service includes compliance audits, improvement plans, and implementation support.',
    user_id,
    NOW() - INTERVAL '21 days'
  ),
  (
    'MealPrep AI',
    'An AI-powered meal planning and grocery shopping assistant that creates personalized weekly meal plans based on dietary preferences, nutrition goals, and what you already have in your pantry.',
    user_id,
    NOW() - INTERVAL '22 days'
  ),
  (
    'RemoteTeams',
    'A comprehensive platform for managing distributed teams that combines project management, time tracking, async communication, and team building activities designed specifically for remote work cultures.',
    user_id,
    NOW() - INTERVAL '23 days'
  ),
  (
    'CircularFashion',
    'A fashion brand where every item can be returned and remade into new styles when you''re done with it. The platform tracks the lifecycle of materials and rewards customers for keeping items in the circular economy.',
    user_id,
    NOW() - INTERVAL '24 days'
  ),
  (
    'HealthHabit',
    'A health coaching platform that uses behavioral science to help users build lasting health habits. The service combines AI-driven nudges with human coaching at critical moments in the behavior change journey.',
    user_id,
    NOW() - INTERVAL '25 days'
  ),
  (
    'LocalTour',
    'A platform where local residents create and guide unique tours of their neighborhoods and cultural experiences. The marketplace emphasizes authentic, non-touristy experiences and fair compensation for guides.',
    user_id,
    NOW() - INTERVAL '26 days'
  ),
  (
    'CraftConnect',
    'An online marketplace connecting skilled artisans with customers seeking custom-made items. The platform handles secure payments, project specifications, and supports artisans with business tools and marketing.',
    user_id,
    NOW() - INTERVAL '27 days'
  ),
  (
    'GigRental',
    'A peer-to-peer rental marketplace for high-end equipment in photography, music, outdoor gear, and other specialized hobbies. The platform includes insurance, verification, and delivery options.',
    user_id,
    NOW() - INTERVAL '28 days'
  ),
  (
    'HomeRepair AI',
    'An AI assistant for DIY home repairs that uses your smartphone camera to diagnose issues, provide step-by-step guidance, create shopping lists, and connect with professionals if the job is too complex.',
    user_id,
    NOW() - INTERVAL '29 days'
  ),
  (
    'CultureBridge',
    'A language learning platform that pairs learners with native speakers who share similar interests for natural conversation practice. The system includes guided topics, cultural context, and feedback mechanisms.',
    user_id,
    NOW() - INTERVAL '30 days'
  );

RAISE NOTICE 'Successfully added 30 mock startup ideas to your database!';
END $$;
