import React, { useState, useRef, useEffect } from 'react';
import { getCoachResponseStream } from '../services/geminiService';
import { ChatMessage, UserTier } from '../types';
import { useAppContext } from '../context/AppContext';
import PremiumModal from '../components/PremiumModal';

const AICoach: React.FC = () => {
  const { userTier, userPreferences } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: `Hey, ${userPreferences?.name || 'there'}! I'm your GlowUp Coach. What's on your mind today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCount = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    if (userTier === UserTier.Free && messageCount.current >= 3) {
      setIsModalOpen(true);
      return;
    }

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await getCoachResponseStream(newMessages, userPreferences);
      
      let aiResponseText = '';
      const aiMessage: ChatMessage = { sender: 'ai', text: '' };
      setMessages(prev => [...prev, aiMessage]);

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        // Update the last message in the array with the new text
        setMessages(prev => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].text = aiResponseText;
          return updatedMessages;
        });
      }
      
      messageCount.current++;
    } catch (error: any) {
      const errorMessage: ChatMessage = { sender: 'ai', text: error.message };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} featureName="Unlimited Coach messages" />
      <header className="pt-12 pb-4 text-center bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Coach</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your pocket guide for confidence.</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-lg' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-lg'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].sender === 'user' && (
            <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-800 p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for advice..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''}
            className="p-3 rounded-full bg-purple-500 text-white disabled:bg-gray-300 transition-all transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
        {userTier === UserTier.Free && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">You have {Math.max(0, 3 - messageCount.current)} free messages left today.</p>}
      </div>
    </div>
  );
};

export default AICoach;