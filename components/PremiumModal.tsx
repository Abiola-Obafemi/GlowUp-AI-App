import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, featureName }) => {
  const { setCurrentPage } = useAppContext();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    setCurrentPage(Page.Premium);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900">
          <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 4.293m5.707 7.293a1 1 0 010 1.414L13.414 15l2.293 2.293a1 1 0 01-1.414 1.414L12 16.414l-2.293 2.293a1 1 0 01-1.414-1.414L10.586 15l-2.293-2.293a1 1 0 010-1.414z" />
          </svg>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mt-4">Upgrade to Premium!</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {featureName} is a Premium feature. Unlock unlimited access and all our glow-up tools.
          </p>
        </div>
        <div className="mt-5 sm:mt-6 space-y-3">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-base font-medium text-white hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
            onClick={handleUpgrade}
          >
            Go Premium
          </button>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={onClose}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;