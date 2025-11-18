import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page, UserPreferences } from '../types';
import { CameraIcon } from '../components/Icons';

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex justify-center space-x-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i + 1 <= current ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
    ))}
  </div>
);

const Onboarding: React.FC = () => {
  const { completeOnboarding, setUserPreferences, setCurrentPage } = useAppContext();
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNextStep = () => {
      setStep(s => s + 1);
  };
  
  const handleSelect = (key: keyof UserPreferences, value: string) => {
    setPrefs(p => ({ ...p, [key]: value }));
    setTimeout(() => setStep(s => s + 1), 300);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const finishOnboarding = () => {
      const finalPrefs: UserPreferences = {
        name: prefs.name || "Glow-Getter",
        age: prefs.age || 16,
        goal: prefs.goal || "Improve my style",
        styleVibe: prefs.styleVibe || "Casual & Comfy",
        challenge: prefs.challenge || "Picking daily outfits",
        profilePicture: imagePreview,
      };
      setUserPreferences(finalPrefs);
      
      if (imagePreview) {
          // Navigate to the analyzer to use the new photo immediately
          setCurrentPage(Page.Analyzer);
      } else {
          setCurrentPage(Page.Home);
      }
      completeOnboarding();
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">What should we call you?</h2>
            <input
              type="text"
              placeholder="Enter your name..."
              value={prefs.name || ''}
              onChange={(e) => setPrefs(p => ({...p, name: e.target.value}))}
              className="mt-6 w-full p-4 text-center bg-white rounded-lg shadow-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-900"
            />
            <button onClick={handleNextStep} disabled={!prefs.name} className="w-full mt-4 py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">Next</button>
          </div>
        );
      case 2:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">How old are you?</h2>
            <input
              type="number"
              placeholder="Enter your age..."
              value={prefs.age || ''}
              onChange={(e) => setPrefs(p => ({...p, age: parseInt(e.target.value)}))}
              className="mt-6 w-full p-4 text-center bg-white rounded-lg shadow-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-900"
            />
            <button onClick={handleNextStep} disabled={!prefs.age || prefs.age < 13} className="w-full mt-4 py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">Next</button>
             {prefs.age && prefs.age < 13 && <p className="text-red-500 text-sm mt-2">You must be at least 13 to use the app.</p>}
          </div>
        );
      case 3:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">What's your main Glow-Up goal?</h2>
            <div className="mt-6 space-y-3">
              <button onClick={() => handleSelect('goal', 'Improve my style')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Improve my style 👕</button>
              <button onClick={() => handleSelect('goal', 'Boost my confidence')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Boost my confidence ✨</button>
              <button onClick={() => handleSelect('goal', 'Develop better habits')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Develop better habits</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">What's your style vibe?</h2>
            <div className="mt-6 space-y-3">
              <button onClick={() => handleSelect('styleVibe', 'Casual & Comfy')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Casual & Comfy 👟</button>
              <button onClick={() => handleSelect('styleVibe', 'Trendy & Modern')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Trendy & Modern 💅</button>
              <button onClick={() => handleSelect('styleVibe', 'Artsy & Unique')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Artsy & Unique 🎨</button>
              <button onClick={() => handleSelect('styleVibe', "I'm not sure yet!")} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">I'm not sure yet! 🤔</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">What's your biggest challenge?</h2>
             <div className="mt-6 space-y-3">
              <button onClick={() => handleSelect('challenge', 'Picking daily outfits')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Picking daily outfits</button>
              <button onClick={() => handleSelect('challenge', 'Feeling confident in social situations')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Feeling confident socially</button>
              <button onClick={() => handleSelect('challenge', 'Sticking to a skincare routine')} className="w-full p-4 bg-white rounded-lg shadow-md font-semibold text-gray-700 hover:bg-purple-100 transition">Sticking to a routine</button>
            </div>
          </div>
        );
      case 6:
         return (
            <div className="text-center animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800">Let's get your first analysis!</h2>
                <p className="text-gray-500 mt-2">Take a selfie to kickstart your journey.</p>
                <div 
                    className="mt-6 w-full max-w-xs h-80 mx-auto bg-purple-50 rounded-3xl border-2 border-dashed border-purple-200 flex items-center justify-center cursor-pointer hover:border-purple-400 transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                {imagePreview ? (
                    <img src={imagePreview} alt="Selfie preview" className="w-full h-full object-cover rounded-3xl" />
                ) : (
                    <div className="text-center text-gray-500">
                    <CameraIcon />
                    <p>Tap to take a photo</p>
                    </div>
                )}
                </div>
                <input type="file" accept="image/*" capture="user" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                <button onClick={finishOnboarding} className="w-full mt-6 py-4 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
                    {imagePreview ? "Let's Go! ✨" : "Skip for now"}
                </button>
            </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col justify-center p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50">
        <header className="absolute top-10 left-0 right-0 px-6 text-center">
             <img src="/logo.svg" alt="GlowUp Logo" className="h-10 mx-auto mb-2" />
             <p className="text-center text-gray-500 mt-1">Let's personalize your experience.</p>
        </header>
        {renderStep()}
        <footer className="absolute bottom-10 left-0 right-0 px-6">
            <StepIndicator current={step} total={6} />
        </footer>
    </div>
  );
};

export default Onboarding;