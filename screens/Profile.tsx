import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page, UserTier } from '../types';

const Profile: React.FC = () => {
    const { userTier, setUserTier, setCurrentPage, userPreferences, theme, setTheme, setUserPreferences } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpgrade = () => {
        setCurrentPage(Page.Premium);
    };
    
    const handleToggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && userPreferences) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPrefs = { ...userPreferences, profilePicture: reader.result as string };
                setUserPreferences(newPrefs);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <header className="pt-8 text-center">
                <div className="relative w-28 h-28 mx-auto group" onClick={() => fileInputRef.current?.click()}>
                    <img 
                        src={userPreferences?.profilePicture || `https://i.pravatar.cc/150?u=${userPreferences?.name || 'guest'}`} 
                        alt="Profile" 
                        className="w-28 h-28 rounded-full mx-auto shadow-lg border-4 border-white dark:border-gray-700 cursor-pointer object-cover" 
                    />
                     <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 cursor-pointer">
                        <span className="text-white font-semibold opacity-0 group-hover:opacity-100">Change</span>
                    </div>
                    {userTier === UserTier.Premium && (
                         <span className="absolute bottom-1 right-1 block h-8 w-8 rounded-full bg-yellow-300 text-yellow-800 text-xl flex items-center justify-center shadow-md border-2 border-white">✨</span>
                    )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfilePicChange} className="hidden" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{userPreferences?.name || 'GlowUp User'}</h1>
                <p className={`text-sm font-semibold mt-1 px-3 py-1 inline-block rounded-full ${userTier === UserTier.Premium ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    {userTier} Member
                </p>
            </header>

            {userTier === UserTier.Free && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 rounded-2xl text-white text-center shadow-xl">
                    <h3 className="font-bold text-lg">Unlock Your Full Potential!</h3>
                    <p className="text-sm mt-1 opacity-90">Get unlimited access to all GlowUp features.</p>
                    <button onClick={handleUpgrade} className="mt-4 bg-white text-purple-600 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition transform hover:scale-105">
                        Upgrade Now
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    <li className="p-3">
                        <label htmlFor="notifications" className="flex justify-between items-center cursor-pointer">
                            <span className="text-gray-700 dark:text-gray-200">Push Notifications</span>
                            <div className="relative">
                                <input id="notifications" type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                            </div>
                        </label>
                    </li>
                    <li className="p-3">
                        <label htmlFor="theme" className="flex justify-between items-center cursor-pointer">
                            <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
                            <div className="relative">
                                <input id="theme" type="checkbox" className="sr-only peer" checked={theme === 'dark'} onChange={handleToggleTheme} />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                            </div>
                        </label>
                    </li>
                     <li onClick={() => setCurrentPage(Page.PrivacyPolicy)} className="p-3 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">Privacy Policy</li>
                     <li onClick={() => setCurrentPage(Page.TermsOfService)} className="p-3 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">Terms of Service</li>
                </ul>
            </div>

            {userTier === UserTier.Premium && (
                <button 
                    onClick={() => setUserTier(UserTier.Free)}
                    className="w-full text-center text-sm text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors py-2"
                >
                    Cancel Subscription
                </button>
            )}

        </div>
    );
};

export default Profile;