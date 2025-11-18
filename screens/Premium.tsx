import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';

const FeatureListItem: React.FC<{ children: React.ReactNode, isPremium: boolean }> = ({ children, isPremium }) => (
    <li className="flex items-start">
        <svg className={`flex-shrink-0 w-5 h-5 ${isPremium ? 'text-purple-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="ml-3 text-base text-gray-700 dark:text-gray-300">{children}</span>
    </li>
);

// This is your public key. It's safe to be in the frontend.
// Replace this with your own Stripe publishable key from the Stripe Dashboard.
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

const PremiumPageContent: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const stripe = useStripe();

    const handleUpgrade = async () => {
        setIsProcessing(true);
        setError(null);
        if (!stripe) {
            setError("Stripe is not ready yet. Please wait a moment and try again.");
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Call your backend, which is now part of the same project.
            // The hosting platform (like Vercel) will know how to handle this path.
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to create checkout session. Please contact support.');
            }

            const session = await response.json();

            // 2. Redirect to Stripe Checkout using the session ID from your server.
            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (stripeError) {
                setError(stripeError.message || "An unexpected error occurred during redirect.");
            }
        } catch (err: any) {
            console.error('Error during upgrade process:', err);
            setError(err.message || "An unknown error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-900 h-full overflow-y-auto">
            <div className="pt-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-lg leading-6 font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">GlowUp Premium</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
                        Unlock Your Ultimate Glow-Up
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Get unlimited access to every tool you need to become your most confident self.
                    </p>
                </div>
            </div>

            <div className="mt-10 pb-12 bg-gray-50 dark:bg-gray-900 sm:pb-16">
                <div className="relative">
                    <div className="absolute inset-0 h-1/2 bg-white dark:bg-gray-900"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
                            <div className="flex-1 bg-white dark:bg-gray-800 px-6 py-8 lg:p-12">
                                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl">Premium Membership</h3>
                                <p className="mt-6 text-base text-gray-500 dark:text-gray-400">
                                    Everything in the free plan, plus exclusive access to our most powerful features.
                                </p>
                                <div className="mt-8">
                                    <div className="flex items-center">
                                        <h4 className="flex-shrink-0 pr-4 bg-white dark:bg-gray-800 text-sm tracking-wider font-semibold uppercase text-purple-600 dark:text-purple-400">
                                            What's included
                                        </h4>
                                        <div className="flex-1 border-t-2 border-gray-200 dark:border-gray-600"></div>
                                    </div>
                                    <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                                        <FeatureListItem isPremium={true}>Unlimited Selfie Analyses</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Full Glow-Up Plan Access</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Unlimited Outfit Building</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Unlimited Coach Messages</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Advanced Style Tips</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Daily Check-ins</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Weekly Glow-Up Challenges</FeatureListItem>
                                        <FeatureListItem isPremium={true}>Ad-Free Experience</FeatureListItem>
                                    </ul>
                                </div>
                            </div>
                            <div className="py-8 px-6 text-center bg-gray-50 dark:bg-gray-800 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                                <p className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Start your journey</p>
                                <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                                    <span>$7.99</span>
                                    <span className="ml-3 text-xl font-medium text-gray-500 dark:text-gray-400">/ mo</span>
                                </div>
                                <p className="mt-4 text-sm">
                                    <a href="#" className="font-medium text-gray-500 dark:text-gray-400 underline">
                                        Cancel anytime
                                    </a>
                                </p>
                                <div className="mt-6">
                                    <div className="rounded-md shadow">
                                        <button
                                            onClick={handleUpgrade}
                                            disabled={isProcessing}
                                            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-70"
                                        >
                                            {isProcessing ? 'Processing...' : 'Go Premium'}
                                        </button>
                                    </div>
                                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Premium: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <PremiumPageContent />
        </Elements>
    );
};

export default Premium;