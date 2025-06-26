import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-57px)]">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto transition-all duration-700 ease-in-out">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}