'use client';

import Link from 'next/link';
import { FaLightbulb } from 'react-icons/fa';

export default function LoginPrompt() {
  return (
    <div className="card p-8 text-center">
      <div className="flex justify-center mb-4">
        <FaLightbulb className="text-6xl text-yellow-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Join Startup Idea Hub</h2>
      
      <p className="text-gray-600 mb-6">
        Sign in to discover, rate, and share innovative startup ideas from around the world.
      </p>
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
        <Link href="/login" className="btn btn-primary">
          Log In
        </Link>
        <Link href="/register" className="btn btn-outline">
          Create Account
        </Link>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="font-semibold mb-3">Why join?</h3>
        <ul className="text-left text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="inline-block mr-2 bg-primary-100 text-primary-600 p-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Discover innovative startup ideas</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2 bg-primary-100 text-primary-600 p-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Share your feedback through swipes and ratings</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block mr-2 bg-primary-100 text-primary-600 p-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Submit your own startup ideas</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
