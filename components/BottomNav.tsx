import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';
import { HomeIcon, SparklesIcon, ClipboardListIcon, UserCircleIcon, ChatAlt2Icon } from './Icons';

const NavItem: React.FC<{
  page: Page;
  icon: React.ReactNode;
  label: string;
}> = ({ page, icon, label }) => {
  const { currentPage, setCurrentPage } = useAppContext();
  const isActive = currentPage === page;

  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-300 transform ${isActive ? 'scale-110' : 'text-gray-400 dark:text-gray-500'}`}
    >
      <div className={isActive ? 'text-purple-600' : ''}>{icon}</div>
      <span className={`text-xs mt-1 font-semibold ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'dark:text-gray-400'}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/70 backdrop-blur-lg border-t border-gray-200 dark:bg-gray-900/70 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">
      <div className="flex justify-around items-center h-full">
        <NavItem page={Page.Home} icon={<HomeIcon />} label="Home" />
        <NavItem page={Page.Analyzer} icon={<SparklesIcon />} label="Analyze" />
        <NavItem page={Page.Plan} icon={<ClipboardListIcon />} label="Plan" />
        <NavItem page={Page.Coach} icon={<ChatAlt2Icon />} label="Coach" />
        <NavItem page={Page.Profile} icon={<UserCircleIcon />} label="Profile" />
      </div>
    </div>
  );
};

export default BottomNav;