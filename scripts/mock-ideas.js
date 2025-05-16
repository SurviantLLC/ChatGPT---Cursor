// Mock ideas generator for Startup Idea Hub
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock startup ideas
const mockIdeas = [
  {
    title: "EcoTrack",
    description: "A mobile app that helps users track their carbon footprint through daily activities and offers personalized suggestions to reduce environmental impact. Features include transportation emissions calculator, household energy usage tracking, and community challenges.",
    tags: ["sustainability", "climate-tech", "mobile-app"],
  },
  {
    title: "MindfulMinutes",
    description: "An AI-powered meditation platform that adapts sessions based on your mood, stress levels, and available time. The app uses speech analysis and optional heart rate data to customize meditation experiences in real-time.",
    tags: ["mental-health", "wellness", "ai"],
  },
  {
    title: "LocalEats Collective",
    description: "A platform connecting local farms directly to consumers through a subscription model. Users get weekly boxes of seasonal produce, and the platform handles logistics while providing transparency about where food comes from and supporting small-scale agriculture.",
    tags: ["food-tech", "subscription", "sustainability"],
  },
  {
    title: "CodeBuddy AI",
    description: "An AI pair programming assistant that integrates with all major IDEs. Beyond just code suggestions, it explains concepts, reviews code quality, suggests refactoring, and helps developers learn while coding by explaining its suggestions in educational terms.",
    tags: ["developer-tools", "ai", "productivity"],
  },
  {
    title: "SeniorConnect",
    description: "A simplified communication platform designed specifically for seniors to stay connected with family members. Features include large text interfaces, voice commands, photo sharing, automated check-ins, and emergency alerts.",
    tags: ["eldercare", "social", "health-tech"],
  },
  {
    title: "SkillSwap",
    description: "A platform where users can exchange skills and knowledge without money changing hands. The time-banking system allows users to teach what they know and learn what they want based on time credits rather than financial payments.",
    tags: ["education", "community", "sharing-economy"],
  },
  {
    title: "NutriScan",
    description: "A mobile app that scans food products and provides personalized nutritional insights based on your dietary goals, restrictions, and health conditions. The app offers alternatives when products don't meet your criteria.",
    tags: ["health-tech", "nutrition", "mobile-app"],
  },
  {
    title: "RentalRights",
    description: "A platform helping renters understand their legal rights and navigate disputes with landlords. The service provides document templates, automated communications, and affordable access to tenant lawyers when needed.",
    tags: ["legal-tech", "housing", "consumer-rights"],
  },
  {
    title: "WasteNoMore",
    description: "An AI-powered smart trash bin that automatically sorts recyclables, compostables, and landfill waste. The system includes a mobile app that tracks your waste reduction progress and environmental impact.",
    tags: ["smart-home", "sustainability", "hardware"],
  },
  {
    title: "MicroLearn",
    description: "A platform offering 5-minute micro-learning courses designed to be completed during small breaks throughout the day. Courses span professional skills, personal development, and specialized knowledge, optimized for retention through spaced repetition.",
    tags: ["education", "productivity", "microlearning"],
  },
  {
    title: "PetPals",
    description: "A neighborhood pet-sitting exchange platform where pet owners can trade pet care services with trusted neighbors. The platform includes verification, pet health profiles, and an emergency backup system.",
    tags: ["pets", "sharing-economy", "community"],
  },
  {
    title: "RetroFit",
    description: "A service that retrofits existing home appliances with smart capabilities at a fraction of the cost of buying new smart appliances. The solution includes easy-to-install adapters and a unified control app.",
    tags: ["smart-home", "sustainability", "iot"],
  },
  {
    title: "CreatorCoin",
    description: "A platform allowing content creators to launch their own social tokens that fans can purchase to access exclusive content, experiences, and community benefits. The system includes tools for creators to manage their token economy.",
    tags: ["creator-economy", "crypto", "social-media"],
  },
  {
    title: "UrbanGrow",
    description: "Modular, stackable indoor gardening system designed for small urban apartments. The system is soil-less, automated, and allows you to grow vegetables, herbs, and small fruits year-round with minimal maintenance.",
    tags: ["food-tech", "sustainability", "smart-home"],
  },
  {
    title: "TravelBuddy",
    description: "An AI travel assistant that creates personalized itineraries based on your interests, budget, and travel style. The platform continually adapts recommendations based on your feedback and changing circumstances like weather or local events.",
    tags: ["travel", "ai", "personalization"],
  },
  {
    title: "SecondChance",
    description: "A marketplace for refurbished electronics with extended warranties and quality guarantees. The platform handles testing, certification, and provides transparent history of device usage and repairs.",
    tags: ["e-commerce", "sustainability", "consumer-tech"],
  },
  {
    title: "SoloWorker",
    description: "A comprehensive platform for freelancers and solopreneurs that bundles accounting, client management, insurance, retirement planning, and tax preparation into one affordable monthly subscription.",
    tags: ["freelance", "fintech", "productivity"],
  },
  {
    title: "VirtualFitClub",
    description: "A VR fitness platform offering immersive group workout classes from anywhere in the world. Classes combine gamification elements with real trainer feedback and social accountability to keep users motivated.",
    tags: ["fitness", "vr", "subscription"],
  },
  {
    title: "CommunityPower",
    description: "A platform enabling neighborhoods to create local renewable energy microgrids, where residents can invest in, share, and trade energy. The system handles billing, maintenance coordination, and regulatory compliance.",
    tags: ["cleantech", "energy", "community"],
  },
  {
    title: "KidFinance",
    description: "A financial literacy app for children that pairs with a parents-managed debit card. The app gamifies saving, charitable giving, and smart spending while teaching age-appropriate financial concepts.",
    tags: ["fintech", "education", "family"],
  },
  {
    title: "AccessibleDesign",
    description: "A platform connecting businesses with accessibility consultants to make physical spaces and digital products more inclusive. The service includes compliance audits, improvement plans, and implementation support.",
    tags: ["accessibility", "b2b", "consulting"],
  },
  {
    title: "MealPrep AI",
    description: "An AI-powered meal planning and grocery shopping assistant that creates personalized weekly meal plans based on dietary preferences, nutrition goals, and what you already have in your pantry.",
    tags: ["food-tech", "ai", "health-tech"],
  },
  {
    title: "RemoteTeams",
    description: "A comprehensive platform for managing distributed teams that combines project management, time tracking, async communication, and team building activities designed specifically for remote work cultures.",
    tags: ["remote-work", "productivity", "team-management"],
  },
  {
    title: "CircularFashion",
    description: "A fashion brand where every item can be returned and remade into new styles when you're done with it. The platform tracks the lifecycle of materials and rewards customers for keeping items in the circular economy.",
    tags: ["fashion", "sustainability", "circular-economy"],
  },
  {
    title: "HealthHabit",
    description: "A health coaching platform that uses behavioral science to help users build lasting health habits. The service combines AI-driven nudges with human coaching at critical moments in the behavior change journey.",
    tags: ["health-tech", "coaching", "habit-formation"],
  },
  {
    title: "LocalTour",
    description: "A platform where local residents create and guide unique tours of their neighborhoods and cultural experiences. The marketplace emphasizes authentic, non-touristy experiences and fair compensation for guides.",
    tags: ["travel", "local-experiences", "marketplace"],
  },
  {
    title: "CraftConnect",
    description: "An online marketplace connecting skilled artisans with customers seeking custom-made items. The platform handles secure payments, project specifications, and supports artisans with business tools and marketing.",
    tags: ["marketplace", "craftsmanship", "e-commerce"],
  },
  {
    title: "GigRental",
    description: "A peer-to-peer rental marketplace for high-end equipment in photography, music, outdoor gear, and other specialized hobbies. The platform includes insurance, verification, and delivery options.",
    tags: ["sharing-economy", "p2p", "rental"],
  },
  {
    title: "HomeRepair AI",
    description: "An AI assistant for DIY home repairs that uses your smartphone camera to diagnose issues, provide step-by-step guidance, create shopping lists, and connect with professionals if the job is too complex.",
    tags: ["home-improvement", "ai", "consumer-service"],
  },
  {
    title: "CultureBridge",
    description: "A language learning platform that pairs learners with native speakers who share similar interests for natural conversation practice. The system includes guided topics, cultural context, and feedback mechanisms.",
    tags: ["education", "language-learning", "cultural-exchange"],
  }
];

async function run() {
  try {
    // First, let's get the currently authenticated user
    console.log('Getting authenticated user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw userError;
    }
    
    if (!user) {
      console.error('You need to be logged in to create mock ideas');
      console.log('Please log in through the app first, then run this script again');
      process.exit(1);
    }
    
    console.log(`Using author_id: ${user.id}`);
    
    // Now insert the mock ideas
    console.log('Inserting mock ideas...');
    
    for (const idea of mockIdeas) {
      const { error } = await supabase.from('ideas').insert({
        ...idea,
        author_id: user.id,
      });
      
      if (error) {
        console.error(`Error inserting idea "${idea.title}":`, error);
      } else {
        console.log(`Inserted: ${idea.title}`);
      }
    }
    
    console.log('Done! Successfully added mock ideas to your database.');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
