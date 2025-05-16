import React from 'react';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Startup Idea Hub',
  description: 'Discover, share, and rate innovative startup ideas',
  keywords: 'startup, ideas, innovation, entrepreneurship, rating',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#0EA5E9" />
      </head>
      <body className="font-sans antialiased text-gray-800 bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'rounded-lg shadow-md p-4',
            success: { className: 'bg-green-50 text-green-800 border-l-4 border-green-500' },
            error: { className: 'bg-red-50 text-red-800 border-l-4 border-red-500' }
          }}
        />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="fade-in">
              {children}
            </div>
          </main>
          <footer className="bg-white border-t border-gray-200 mt-auto py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                    Startup Idea Hub
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} Startup Idea Hub. All rights reserved.
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
