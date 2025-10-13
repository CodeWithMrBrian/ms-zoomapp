import React, { useState, useRef, useCallback } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

/**
 * Tabs component for multi-panel interfaces with dark mode support
 * Includes keyboard navigation with arrow keys (Material Design standard)
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  }, [onChange]);

  // Enhanced keyboard navigation with arrow keys
  const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
    const { key } = event;
    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= tabs.length) newIndex = 0; // Wrap to first tab
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = tabs.length - 1; // Wrap to last tab
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return; // Don't handle other keys
    }

    // Focus and activate new tab
    const newTab = tabs[newIndex];
    if (newTab && tabRefs.current[newIndex]) {
      tabRefs.current[newIndex]?.focus();
      handleTabClick(newTab.id);
    }
  }, [tabs, handleTabClick]);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab Headers with Enhanced Keyboard Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav 
          className="flex space-x-8" 
          aria-label="Settings navigation"
          role="tablist"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                ${
                  activeTab === tab.id
                    ? 'border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 transform scale-105'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:transform hover:scale-102'
                }
              `.trim()}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
              {/* Active tab indicator with smooth animation */}
              {activeTab === tab.id && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content with ARIA labeling */}
      <div 
        className="mt-6"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
