import React, { useState, useEffect } from 'react';
import { generateGlowUpPlan } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { UserTier } from '../types';
import PremiumModal from '../components/PremiumModal';

const PlanItem: React.FC<{ label: string, details: string, onCheck: () => void, isChecked: boolean, isLocked?: boolean }> = ({ label, details, onCheck, isChecked, isLocked }) => (
    <div className="flex items-start space-x-3 p-2 rounded-lg">
        <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={onCheck}
            disabled={isLocked}
            className="mt-1 h-5 w-5 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
        />
        <label className="flex-1">
            <span className={`font-semibold ${isChecked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>{label}</span>
            <p className={`text-sm ${isChecked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{details}</p>
        </label>
    </div>
);


const GlowUpPlan: React.FC = () => {
  const { userTier, userPreferences } = useAppContext();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const generatedPlan = await generateGlowUpPlan(userPreferences);
        setPlan(generatedPlan);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [userPreferences]);

  const handlePremiumFeatureClick = () => {
    if (userTier === UserTier.Free) {
        setIsModalOpen(true);
    }
  };
  
  const handleCheck = (day: string, item: string) => {
      const key = `${day}-${item}`;
      setCheckedItems(prev => ({...prev, [key]: !prev[key]}));
  };

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;

  return (
    <div className="p-4 space-y-6">
      <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} featureName="Full glow-up plan & challenges"/>
      <header className="pt-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your Glow-Up Plan</h1>
        <p className="text-md text-gray-500 dark:text-gray-400 mt-2">A 7-day guide to a more confident you.</p>
      </header>
      <div className="space-y-4">
        {Object.entries(plan).map(([day, details]: [string, any], index) => {
          const isPremiumLocked = userTier === UserTier.Free && index >= 2;
          return (
            <div key={day} className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg transition-all relative overflow-hidden`}>
              <h3 className="font-bold text-xl text-purple-600 dark:text-purple-400 mb-2">{day}</h3>
                <div className={`space-y-2 ${isPremiumLocked ? 'blur-sm' : ''}`}>
                   <PlanItem label="💧 Skincare" details={details.skincare} isChecked={!!checkedItems[`${day}-skincare`]} onCheck={() => handleCheck(day, 'skincare')} isLocked={isPremiumLocked}/>
                   <PlanItem label="🧼 Hygiene" details={details.hygiene} isChecked={!!checkedItems[`${day}-hygiene`]} onCheck={() => handleCheck(day, 'hygiene')} isLocked={isPremiumLocked}/>
                   <PlanItem label="🎯 Goals" details={details.goals} isChecked={!!checkedItems[`${day}-goals`]} onCheck={() => handleCheck(day, 'goals')} isLocked={isPremiumLocked}/>
                   <PlanItem label="🧠 Mindset" details={details.mindset} isChecked={!!checkedItems[`${day}-mindset`]} onCheck={() => handleCheck(day, 'mindset')} isLocked={isPremiumLocked}/>
                   <PlanItem label="Challenge" details={details.challenge} isChecked={!!checkedItems[`${day}-challenge`]} onCheck={() => handleCheck(day, 'challenge')} isLocked={isPremiumLocked}/>
                </div>
              {isPremiumLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-gray-800/30 cursor-pointer" onClick={handlePremiumFeatureClick}>
                  <div className="text-center p-4 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-xl">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">Unlock {day} and beyond!</p>
                      <span className="mt-2 inline-block bg-yellow-300 text-yellow-800 px-3 py-1 text-xs font-bold rounded-full">✨ Premium</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GlowUpPlan;