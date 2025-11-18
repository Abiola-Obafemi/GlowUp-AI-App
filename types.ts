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