import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, readonly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleMouseEnter = (index: number) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(null);
  };

  const handleClick = (index: number) => {
    if (!readonly && onChange) onChange(index);
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex space-x-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= currentRating;
        return (
          <button
            key={index}
            type="button"
            className={`${readonly ? 'cursor-default' : 'cursor-pointer focus:outline-none transition-transform hover:scale-110'}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            disabled={readonly}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isFilled ? 'fill-amber text-amber' : 'fill-transparent text-muted'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
