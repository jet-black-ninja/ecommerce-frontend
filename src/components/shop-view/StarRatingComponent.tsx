import { StarIcon } from 'lucide-react';

import { Button } from '../ui/button';
type StarRatingComponentProps = {
  rating: 1 | 2 | 3 | 4 | 5; // Explicitly defining the possible values for `rating`
  handleRatingChange: (newRating: 1 | 2 | 3 | 4 | 5) => void; // Similarly, define the type for `handleRatingChange`
};
function StarRatingComponent({
  rating,
  handleRatingChange,
}: StarRatingComponentProps) {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? 'text-yellow-500 hover:bg-black'
          : 'text-black hover:bg-primary hover:text-primary-foreground'
      }`}
      variant="outline"
      size="icon"
      onClick={
        handleRatingChange
          ? () => handleRatingChange(star as 1 | 2 | 3 | 4 | 5)
          : undefined
      }
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating ? 'fill-yellow-500' : 'fill-black'
        }`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
