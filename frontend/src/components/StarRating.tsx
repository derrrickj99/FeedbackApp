import { Star } from "lucide-react";

const StarRating = ({ rating, onRatingChange, readOnly = false }: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-400'
          } ${readOnly ? 'cursor-default' : ''}`}
          onClick={() => !readOnly && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;