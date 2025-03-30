import  { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

interface TabsContainerProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  content: Record<string, ReactNode>;
}

const TabsContainer = ({ tabs, activeTab, onChange, content }: TabsContainerProps) => {
  return (
    <div className="mt-6">
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 text-sm font-medium -mb-px whitespace-nowrap
              ${activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => onChange(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {content[activeTab]}
        </motion.div>
      </div>
    </div>
  );
};

export default TabsContainer;
 