import React, { useEffect, useRef } from 'react';

interface SidebarLayoutProps {
  children: React.ReactNode;
  maxWidth?: number | string;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  pageTitle?: string;
}

const paddingMap = {
  sm: 'pl-2 pr-0 py-2',
  md: 'pl-4 pr-0 py-4', 
  lg: 'pl-6 pr-0 py-6',
};

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  maxWidth = 480,
  padding = 'md',
  className = '',
  pageTitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus management and page title handling
  useEffect(() => {
    // Focus the container for screen readers and accessibility
    if (containerRef.current) {
      containerRef.current.focus();
    }

    // Set page title if provided
    if (pageTitle) {
      const originalTitle = document.title;
      document.title = `${pageTitle} | MeetingSync`;
      
      // Restore original title on cleanup
      return () => {
        document.title = originalTitle;
      };
    }
  }, [pageTitle]);

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-screen max-h-screen flex flex-col bg-background overflow-y-auto overflow-x-hidden ${paddingMap[padding]} ${className}`}
      style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
      data-testid="sidebar-layout"
      tabIndex={-1}
      role="main"
      aria-label={pageTitle || "Page content"}
    >
      <div className="w-full min-w-0">
        {children}
      </div>
    </div>
  );
};

export const SidebarSettingsLayout: React.FC<SidebarLayoutProps> = (props) => (
  <SidebarLayout maxWidth={480} padding="lg" {...props} />
);

export const SidebarCompactLayout: React.FC<SidebarLayoutProps> = (props) => (
  <SidebarLayout maxWidth={480} padding="md" {...props} />
);
