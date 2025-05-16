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
    <div className="flex items-center justify-between rounded-md bg-gray-50 py-1 px-2">
      <div className="flex">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ratingValue) => {
          const isActive = (hoverRating || value || 0) >= ratingValue;
          
          return (
            <button
              type="button"
              key={ratingValue}
              onClick={() => handleRatingClick(ratingValue)}
              onMouseEnter={() => handleRatingHover(ratingValue)}
              onMouseLeave={handleRatingHoverEnd}
              className="cursor-pointer p-0.5 focus:outline-none"
              aria-label={`Rate ${ratingValue} of 10`}
            >
              <FaStar 
                size={12}
                className={isActive ? 'text-yellow-500' : 'text-gray-300'}
              />
            </button>
          );
        })}
      </div>
      
      <div className="text-sm font-medium ml-2 min-w-[20px] text-center">
        {value || hoverRating || '-'}
      </div>
    </div>
  );
}
