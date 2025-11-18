export enum Page {
  Home = 'Home',
  Analyzer = 'Analyzer',
  Plan = 'Plan',
  Outfit = 'Outfit',
  Coach = 'Coach',
  Tracker = 'Tracker',
  Profile = 'Profile',
  Premium = 'Premium',
  PrivacyPolicy = 'PrivacyPolicy',
  TermsOfService = 'TermsOfService',
  SubscriptionSuccess = 'SubscriptionSuccess',
}

export enum UserTier {
  Free = 'Free',
  Premium = 'Premium',
}

export type Theme = 'light' | 'dark';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface AnalysisResult {
  outfitFeedback: string;
  groomingSuggestions: string;
  hairstyleIdeas: string;
  aestheticIdeas: string;
}

export interface UserPreferences {
  name: string;
  age: number;
  goal: string;
  styleVibe: string;
  challenge: string;
  profilePicture: string | null;
}

// Fix for TypeScript error: Property 'env' does not exist on type 'ImportMeta'.
// This manually defines the types for Vite's environment variables.
// FIX: Wrapped in `declare global` to correctly augment the global scope from within a module.
declare global {
  interface ImportMetaEnv {
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}