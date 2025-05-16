'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

type RatingInputProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export default function RatingInput({ value, onChange }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const handleRatingClick = (rating: number) => {
    onChange(rating);
  };
  
  const handleRatingHover = (rating: number) => {
    setHoverRating(rating);
  };
  
  const handleRatingHoverEnd = () => {
    setHoverRating(null);
  };
  
  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
      <div className="flex">
        {[...Array(10)].map((_, i) => {
          const ratingValue = i + 1;
          const isActive = (hoverRating || value || 0) >= ratingValue;
          
          return (
            <button
              type="button"
              key={ratingValue}
              onClick={() => handleRatingClick(ratingValue)}
              onMouseEnter={() => handleRatingHover(ratingValue)}
              onMouseLeave={handleRatingHoverEnd}
              className={`cursor-pointer p-1 focus:outline-none`}
            >
              <FaStar 
                className={`text-lg ${
                  isActive ? 'text-yellow-500' : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      
      <div className="text-lg font-bold ml-4 min-w-[30px] text-center">
        {value || hoverRating || '-'}
      </div>
    </div>
  );
}
