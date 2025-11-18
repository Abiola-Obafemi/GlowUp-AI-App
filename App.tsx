import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import SelfieAnalyzer from './screens/SelfieAnalyzer';
import GlowUpPlan from './screens/GlowUpPlan';
import OutfitBuilder from './screens/OutfitBuilder';
import AICoach from './screens/AICoach';
import ProgressTracker from './screens/ProgressTracker';
import Profile from './screens/Profile';
import Premium from './screens/Premium';
import Onboarding from './screens/Onboarding';
import { PrivacyPolicy } from './screens/PrivacyPolicy';
import { TermsOfService } from './screens/TermsOfService';
import SubscriptionSuccess from './screens/SubscriptionSuccess';
import { Page, UserTier } from './types';
import { requestNotificationPermission } from './utils/notifications';

const App: React.FC = () => {
  const { currentPage, isOnboarding, completeOnboarding, theme, setCurrentPage, setUserTier } = useAppContext();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Check if onboarding is complete from localStorage on initial load
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    if (onboardingComplete) {
      completeOnboarding();
    }
    setShowApp(true);
  }, [completeOnboarding]);

  useEffect(() => {
    if (!isOnboarding) {
        // Ask for notification permission after onboarding is complete
        requestNotificationPermission();
    }
  }, [isOnboarding]);

  useEffect(() => {
    // Apply theme for dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    // Handle Stripe redirect after successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('subscription') === 'success') {
        // In a real app, you'd verify the session server-side before granting premium.
        // For this demo, we'll grant it on redirect, assuming the webhook has already updated the user's state.
        setUserTier(UserTier.Premium);
        setCurrentPage(Page.SubscriptionSuccess);
        
        // Clean up the URL so the user doesn't see this page on refresh
        window.history.replaceState(null, '', window.location.pathname);
    }
  }, [setCurrentPage, setUserTier]);


  const renderScreen = () => {
    switch (currentPage) {
      case Page.Home: return <Home />;
      case Page.Analyzer: return <SelfieAnalyzer />;
      case Page.Plan: return <GlowUpPlan />;
      case Page.Outfit: return <OutfitBuilder />;
      case Page.Coach: return <AICoach />;
      case Page.Tracker: return <ProgressTracker />;
      case Page.Profile: return <Profile />;
      case Page.Premium: return <Premium />;
      case Page.PrivacyPolicy: return <PrivacyPolicy />;
      case Page.TermsOfService: return <TermsOfService />;
      case Page.SubscriptionSuccess: return <SubscriptionSuccess />;
      default: return <Home />;
    }
  };

  if (!showApp) {
    return null; // or a loading spinner
  }
  
  const isTextHeavyPage = currentPage === Page.PrivacyPolicy || currentPage === Page.TermsOfService;

  return (
    <div className="h-screen w-screen bg-transparent flex justify-center font-sans">
      <div className={`h-full w-full flex flex-col ${isOnboarding ? '' : 'shadow-2xl'} ${isTextHeavyPage ? 'max-w-4xl' : 'max-w-md'}`}>
        {isOnboarding ? (
          <Onboarding />
        ) : (
          <>
            <main className="flex-1 overflow-y-auto pb-20 dark:bg-gray-900">
              {renderScreen()}
            </main>
            {!isTextHeavyPage && <BottomNav /> }
          </>
        )}
      </div>
    </div>
  );
};

export default App;