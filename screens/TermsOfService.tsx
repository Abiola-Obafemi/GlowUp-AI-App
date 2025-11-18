import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';

export const TermsOfService: React.FC = () => {
    const { setCurrentPage } = useAppContext();

    return (
        <div className="p-6 h-full overflow-y-auto text-gray-800 dark:text-gray-200">
            <button onClick={() => setCurrentPage(Page.Profile)} className="mb-6 text-purple-600 dark:text-purple-400 font-semibold">
                &larr; Back to Profile
            </button>
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-4 text-base">
                <p>Welcome to GlowUp! This is a placeholder Terms of Service agreement. Please read these terms carefully before using our application.</p>
                
                <h2 className="text-2xl font-bold pt-4">1. Acceptance of Terms</h2>
                <p>By accessing or using GlowUp, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service. You must be at least 13 years old to use this application.</p>

                <h2 className="text-2xl font-bold pt-4">2. Use of Service</h2>
                <p>GlowUp provides personalized style and confidence advice through an AI assistant. You agree to use the service for its intended purposes and not to misuse it. You are responsible for any content you upload.</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Do not upload content that is illegal, offensive, or infringes on others' rights.</li>
                    <li>Do not attempt to disrupt or compromise the service.</li>
                </ul>

                <h2 className="text-2xl font-bold pt-4">3. Subscriptions</h2>
                <p>Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Subscriptions automatically renew unless canceled.</p>
                
                <h2 className="text-2xl font-bold pt-4">4. Limitation of Liability</h2>
                <p>The advice provided by the AI is for informational and entertainment purposes only. It is not a substitute for professional advice. We are not liable for any decisions you make based on the information provided in the app.</p>

                <h2 className="text-2xl font-bold pt-4">5. Changes to Terms</h2>
                <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.</p>
            </div>
        </div>
    );
};