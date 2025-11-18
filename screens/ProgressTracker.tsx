import React, { useState, useRef } from 'react';
import { CameraIcon } from '../components/Icons';

const ProgressTracker: React.FC = () => {
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [confidence, setConfidence] = useState(5);
    const [skinClarity, setSkinClarity] = useState(5);
    const [styleScore, setStyleScore] = useState(5);
    const beforeRef = useRef<HTMLInputElement>(null);
    const afterRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setter(URL.createObjectURL(file));
        }
    };

    return (
        <div className="p-4 space-y-6">
            <header className="pt-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Progress Tracker</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Celebrate your glow-up journey!</p>
            </header>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">Before & After Photos</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Your photos are saved privately on your device and are only visible to you.</p>
                <div className="flex justify-between space-x-4">
                    <div className="w-1/2">
                        <label className="text-center block font-medium text-gray-700 dark:text-gray-300">Before</label>
                        <div onClick={() => beforeRef.current?.click()} className="mt-1 flex justify-center items-center h-40 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer overflow-hidden">
                            {beforeImage ? <img src={beforeImage} className="object-cover h-full w-full" alt="Before" /> : (
                                <div className="space-y-1 text-center text-gray-400 dark:text-gray-500">
                                    <CameraIcon />
                                    <p className="text-xs">Upload Photo</p>
                                </div>
                            )}
                        </div>
                        <input ref={beforeRef} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, setBeforeImage)} />
                    </div>
                    <div className="w-1/2">
                        <label className="text-center block font-medium text-gray-700 dark:text-gray-300">After</label>
                        <div onClick={() => afterRef.current?.click()} className="mt-1 flex justify-center items-center h-40 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer overflow-hidden">
                            {afterImage ? <img src={afterImage} className="object-cover h-full w-full" alt="After" /> : (
                                <div className="space-y-1 text-center text-gray-400 dark:text-gray-500">
                                    <CameraIcon />
                                    <p className="text-xs">Upload Photo</p>
                                </div>
                            )}
                        </div>
                         <input ref={afterRef} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, setAfterImage)} />
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg space-y-6">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Weekly Check-in</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Level: <span className="font-bold text-pink-500">{confidence}</span></label>
                    <input type="range" min="1" max="10" value={confidence} onChange={e => setConfidence(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skin Clarity: <span className="font-bold text-sky-500">{skinClarity}</span></label>
                    <input type="range" min="1" max="10" value={skinClarity} onChange={e => setSkinClarity(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Personal Style: <span className="font-bold text-purple-500">{styleScore}</span></label>
                    <input type="range" min="1" max="10" value={styleScore} onChange={e => setStyleScore(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                </div>
            </div>

            <button className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:-translate-y-0.5 transition-all">
                Save My Progress
            </button>
        </div>
    );
};

export default ProgressTracker;