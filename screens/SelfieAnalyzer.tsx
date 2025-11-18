import React, { useState, useRef } from 'react';
import { analyzeSelfie, fileToBase64 } from '../services/geminiService';
import { AnalysisResult, UserTier } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import PremiumModal from '../components/PremiumModal';
import { CameraIcon } from '../components/Icons';
import { useAppContext } from '../context/AppContext';

const AccordionItem: React.FC<{ title: string; content: string; icon: string; defaultOpen?: boolean }> = ({ title, content, icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
          <span className="mr-3 text-2xl">{icon}</span>
          {title}
        </h3>
        <svg className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">{content}</p>
        </div>
      )}
    </div>
  );
};

const SelfieAnalyzer: React.FC = () => {
  const { userTier, userPreferences } = useAppContext();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (userTier === UserTier.Free && analysisCount >= 1) {
      setIsModalOpen(true);
      return;
    }

    if (!fileInputRef.current?.files?.[0]) {
      setError("Please upload a selfie first!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const file = fileInputRef.current.files[0];
      const base64Image = await fileToBase64(file);
      const result = await analyzeSelfie(base64Image, userPreferences);
      setAnalysisResult(result);
      setAnalysisCount(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const dailyLimitReached = userTier === UserTier.Free && analysisCount >= 1;

  return (
    <div className="p-4 space-y-6">
      <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} featureName="Unlimited selfie analysis" />
      <header className="pt-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Style Analyzer</h1>
        <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Get personalized feedback in seconds.</p>
        {userTier === UserTier.Free && <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Free analyses remaining today: {1 - analysisCount}</p>}
      </header>
      
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="relative w-full max-w-xs h-80 bg-purple-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-purple-200 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-purple-400 transition group overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Selfie preview" className="w-full h-full object-cover rounded-3xl" />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <CameraIcon />
              <p>Tap to upload a selfie</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
             <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{imagePreview ? 'Change Photo' : 'Upload Photo'}</p>
          </div>
        </div>
        <input type="file" accept="image/*" capture="user" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !imagePreview || dailyLimitReached}
        className="w-full py-4 px-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        {isLoading ? 'Analyzing...' : 'Get My Feedback ✨'}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {isLoading && <LoadingSpinner />}
      
      {analysisResult && (
        <div className="space-y-3 animate-fade-in">
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 pt-4">Your Glow-Up Analysis</h2>
            <AccordionItem title="Outfit Feedback" content={analysisResult.outfitFeedback} icon="👕" defaultOpen={true} />
            <AccordionItem title="Grooming Suggestions" content={analysisResult.groomingSuggestions} icon="🧼" />
            <AccordionItem title="Hairstyle Ideas" content={analysisResult.hairstyleIdeas} icon="💇‍♀️" />
            <AccordionItem title="Aesthetic Ideas" content={analysisResult.aestheticIdeas} icon="🎨" />
        </div>
      )}
    </div>
  );
};

export default SelfieAnalyzer;