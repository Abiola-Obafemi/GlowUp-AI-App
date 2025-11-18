import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';

const SubscriptionSuccess: React.FC = () => {
    const { setCurrentPage } = useAppContext();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in bg-gray-50 dark:bg-gray-900">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Upgrade Successful!</h2>
            <p className="mt-4 max-w-md mx-auto text-xl text-gray-500 dark:text-gray-400">
                Welcome to GlowUp Premium! You now have unlimited access to all features.
            </p>
            <button
                onClick={() => setCurrentPage(Page.Home)}
                className="mt-8 w-full max-w-xs flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
                Start Glowing Up
            </button>
        </div>
    );
};

export default SubscriptionSuccess;