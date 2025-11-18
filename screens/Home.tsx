import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';
import { SparklesIcon, ClipboardListIcon, BeakerIcon, ChartBarIcon, ArrowRightIcon } from '../components/Icons';
import { getDailyTip } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';

const FeatureCard: React.FC<{ title: string, description: string, icon: React.ReactNode, page: Page, gradient: string }> = 
({ title, description, icon, page, gradient }) => {
    const { setCurrentPage } = useAppContext();
    return (
        <button onClick={() => setCurrentPage(page)} className={`w-full p-4 rounded-2xl text-left flex items-center space-x-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${gradient} text-white`}>
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-white/30 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm opacity-90">{description}</p>
            </div>
            <div className="flex-grow"></div>
            <ArrowRightIcon />
        </button>
    );
}

const Home: React.FC = () => {
    const { setCurrentPage, userPreferences } = useAppContext();
    const [dailyTip, setDailyTip] = useState<string>('');
    const [isLoadingTip, setIsLoadingTip] = useState(true);

    const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

    useEffect(() => {
        const fetchTip = async () => {
            setIsLoadingTip(true);
            const cachedTipData = localStorage.getItem('dailyTip');
            if (cachedTipData) {
                const { date, tip } = JSON.parse(cachedTipData);
                if (date === todayKey) {
                    setDailyTip(tip);
                    setIsLoadingTip(false);
                    return;
                }
            }

            try {
                const tip = await getDailyTip(userPreferences);
                setDailyTip(tip);
                localStorage.setItem('dailyTip', JSON.stringify({ date: todayKey, tip }));
            } catch (error) {
                console.error(error);
                setDailyTip("Be yourself; everyone else is already taken. ✨");
            } finally {
                setIsLoadingTip(false);
            }
        };
        fetchTip();
    }, [userPreferences, todayKey]);
    
    const greeting = useMemo(() => {
        const name = userPreferences?.name;
        const hour = new Date().getHours();
        if (hour < 12) return `Good morning, ${name}!`;
        if (hour < 18) return `Good afternoon, ${name}!`;
        return `Good evening, ${name}!`;
    }, [userPreferences?.name]);

    return (
        <div className="p-4 space-y-6">
            <header className="pt-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{greeting}</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Ready to shine today?</p>
            </header>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
                <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400 mb-2">✨ Daily Glow-Up Tip</h3>
                {isLoadingTip ? <LoadingSpinner /> : (
                     <p className="text-gray-700 dark:text-gray-300">{dailyTip}</p>
                )}
            </div>

            <div 
                onClick={() => setCurrentPage(Page.Analyzer)}
                className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform duration-300"
            >
                <h2 className="font-bold text-2xl">Style Analyzer</h2>
                <p className="mt-2 text-sm opacity-90">Get instant, personalized feedback on your style. Try it now!</p>
                <div className="mt-4 text-right">
                    <span className="inline-block bg-white/30 rounded-full px-4 py-2 text-sm font-semibold">Get Feedback</span>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="font-semibold text-xl text-gray-700 dark:text-gray-200 px-2">Your Tools</h2>
                <FeatureCard 
                    title="Glow-Up Plan"
                    description="Your daily guide to a better you."
                    icon={<ClipboardListIcon />}
                    page={Page.Plan}
                    gradient="bg-gradient-to-r from-sky-400 to-blue-500"
                />
                 <FeatureCard 
                    title="Outfit Builder"
                    description="Create amazing looks from your closet."
                    icon={<BeakerIcon />}
                    page={Page.Outfit}
                    gradient="bg-gradient-to-r from-purple-400 to-indigo-500"
                />
                 <FeatureCard 
                    title="Progress Tracker"
                    description="See your amazing journey unfold."
                    icon={<ChartBarIcon />}
                    page={Page.Tracker}
                    gradient="bg-gradient-to-r from-pink-400 to-rose-500"
                />
            </div>
        </div>
    );
};

export default Home;