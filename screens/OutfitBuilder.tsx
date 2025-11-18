import React, { useState } from 'react';
import { buildOutfit } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { UserTier } from '../types';
import PremiumModal from '../components/PremiumModal';
import { TshirtIcon, PantIcon, JacketIcon, ShoeIcon } from '../components/Icons';

interface ClothingItem {
    name: string;
    icon: React.ReactNode;
}

const clothingItems: Record<string, ClothingItem[]> = {
  Tops: [
    { name: "T-shirt", icon: <TshirtIcon /> }, { name: "Blouse", icon: <TshirtIcon /> }, { name: "Sweater", icon: <TshirtIcon /> }, { name: "Hoodie", icon: <TshirtIcon /> }, { name: "Crop Top", icon: <TshirtIcon /> }
  ],
  Bottoms: [
    { name: "Jeans", icon: <PantIcon /> }, { name: "Skirt", icon: <PantIcon /> }, { name: "Shorts", icon: <PantIcon /> }, { name: "Leggings", icon: <PantIcon /> }, { name: "Trousers", icon: <PantIcon /> }
  ],
  Outerwear: [
    { name: "Jacket", icon: <JacketIcon /> }, { name: "Cardigan", icon: <JacketIcon /> }, { name: "Blazer", icon: <JacketIcon /> }, { name: "Denim Jacket", icon: <JacketIcon /> }
  ],
  Shoes: [
    { name: "Sneakers", icon: <ShoeIcon /> }, { name: "Boots", icon: <ShoeIcon /> }, { name: "Sandals", icon: <ShoeIcon /> }, { name: "Flats", icon: <ShoeIcon /> }
  ],
};

const occasions = ["School", "Casual Day", "Party", "Formal Event", "Seasonal"];

const OutfitBuilder: React.FC = () => {
    const { userTier, userPreferences } = useAppContext();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedOccasion, setSelectedOccasion] = useState<string>(occasions[0]);
    const [generatedOutfit, setGeneratedOutfit] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleItem = (item: string) => {
        if (userTier === UserTier.Free && selectedItems.length >= 4 && !selectedItems.includes(item)) {
            setIsModalOpen(true);
            return;
        }
        setSelectedItems(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleGenerate = async () => {
        if (selectedItems.length < 2) {
            setError("Please select at least 2 items.");
            return;
        }
        setError(null);
        setIsLoading(true);
        setGeneratedOutfit('');
        try {
            const result = await buildOutfit(selectedItems, selectedOccasion, userPreferences);
            setGeneratedOutfit(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} featureName="Unlimited item selection" />
            <header className="pt-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Outfit Builder</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Create the perfect look for any occasion.</p>
            </header>

            <div className="space-y-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h3 className="font-semibold text-lg text-center dark:text-gray-100">1. Select your items {userTier === UserTier.Free && <span className="font-normal text-purple-600 dark:text-purple-400">(Max 4 for free)</span>}</h3>
                {Object.entries(clothingItems).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="font-medium text-gray-600 dark:text-gray-300 mb-3">{category}</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {items.map(item => (
                                <button key={item.name} onClick={() => toggleItem(item.name)}
                                    className={`flex flex-col items-center justify-center p-2 text-sm rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${selectedItems.includes(item.name) ? 'bg-purple-500 text-white border-purple-500 shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent'}`}>
                                    {item.icon}
                                    <span className="mt-1 text-xs text-center">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h3 className="font-semibold text-lg text-center dark:text-gray-100">2. Choose the occasion</h3>
                <select value={selectedOccasion} onChange={e => setSelectedOccasion(e.target.value)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border-transparent border rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none">
                    {occasions.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                </select>
            </div>

            <button onClick={handleGenerate} disabled={isLoading}
                className="w-full py-4 px-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {isLoading ? 'Creating...' : 'Build My Outfit 🎨'}
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {isLoading && <LoadingSpinner />}

            {generatedOutfit && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
                    <h3 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-3">Your Styled Outfit!</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{generatedOutfit}</p>
                </div>
            )}
        </div>
    );
};

export default OutfitBuilder;