import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';

export const PrivacyPolicy: React.FC = () => {
  const { setCurrentPage } = useAppContext();

  return (
    <div className="p-6 h-full overflow-y-auto text-gray-800 dark:text-gray-200">
      <button onClick={() => setCurrentPage(Page.Profile)} className="mb-6 text-purple-600 dark:text-purple-400 font-semibold">
        &larr; Back to Profile
      </button>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-4 text-base">
        <p>Welcome to GlowUp! This is a placeholder Privacy Policy. In a real application, this document would detail how user data is collected, used, and protected.</p>
        
        <h2 className="text-2xl font-bold pt-4">1. Information We Collect</h2>
        <p>We would typically collect information you provide directly to us, such as:</p>
        <ul className="list-disc list-inside pl-4">
          <li>Personal details (name, age) for personalizing your experience.</li>
          <li>User preferences (goals, style) to tailor AI responses.</li>
          <li>Uploaded content, such as selfies for analysis. This data is processed and not stored long-term on our servers.</li>
          <li>Usage data to help us improve the app.</li>
        </ul>

        <h2 className="text-2xl font-bold pt-4">2. How We Use Your Information</h2>
        <p>Your data would be used to:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Provide, maintain, and improve our services.</li>
            <li>Personalize your in-app experience.</li>
            <li>Communicate with you, including sending notifications you've opted into.</li>
        </ul>
        
        <h2 className="text-2xl font-bold pt-4">3. Data Storage and Security</h2>
        <p>We prioritize your privacy. Photos you upload for analysis are sent to our AI partner for processing and are not stored by us. Your preferences and progress data are stored securely. We use industry-standard measures to protect your information.</p>
        
        <h2 className="text-2xl font-bold pt-4">4. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information. This can be managed through your profile settings or by contacting us directly.</p>

        <h2 className="text-2xl font-bold pt-4">5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@glowupapp.example.com.</p>
      </div>
    </div>
  );
};