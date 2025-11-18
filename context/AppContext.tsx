import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Page, UserTier, UserPreferences, Theme } from '../types';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  isOnboarding: boolean;
  completeOnboarding: () => void;
  userPreferences: UserPreferences | null;
  setUserPreferences: (prefs: UserPreferences) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [userTier, setUserTierState] = useState<UserTier>(() => (localStorage.getItem('userTier') as UserTier) || UserTier.Free);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences | null>(() => {
      const savedPrefs = localStorage.getItem('userPreferences');
      return savedPrefs ? JSON.parse(savedPrefs) : null;
  });
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  const setUserTier = (tier: UserTier) => {
    setUserTierState(tier);
    localStorage.setItem('userTier', tier);
  };

  const setUserPreferences = (prefs: UserPreferences) => {
      setUserPreferencesState(prefs);
      localStorage.setItem('userPreferences', JSON.stringify(prefs));
  };

  const setTheme = (theme: Theme) => {
    setThemeState(theme);
    localStorage.setItem('theme', theme);
  };
  
  const completeOnboarding = useCallback(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if(savedPrefs) {
        setUserPreferencesState(JSON.parse(savedPrefs));
    }
    setIsOnboarding(false);
    localStorage.setItem('onboardingComplete', 'true');
  }, []);

  return (
    <AppContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      userTier, 
      setUserTier,
      isOnboarding,
      completeOnboarding,
      userPreferences,
      setUserPreferences,
      theme,
      setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};