import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import { Review } from "./types";

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

interface RatingBarProps {
  star: number;
  percentage: number;
}

const RatingBar = ({ star, percentage }: RatingBarProps) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground w-14">{star} star</span>
    <div className="flex-1 bg-muted rounded-full h-2">
      <div
        className="bg-yellow-400 h-2 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-sm text-muted-foreground w-12 text-right">
      {percentage}%
    </span>
  </div>
);

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => (
  <article className="border-b border-border pb-6 last:border-b-0">
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h4 className="font-semibold text-foreground">{review.author}</h4>
          {review.verified && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
            >
              <Check className="w-3 h-3 mr-1" />
              Verified Purchase
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} size="sm" />
          <time className="text-sm text-muted-foreground">{review.date}</time>
        </div>
      </div>
    </div>
    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
  </article>
);

export const ReviewsSection = ({
  reviews,
  rating,
  reviewCount,
}: ReviewsSectionProps) => {
  // Mock rating distribution - replace with actual data
  const ratingDistribution: Record<number, number> = {
    5: 75,
    4: 20,
    3: 5,
    2: 0,
    1: 0,
  };

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Customer Reviews
        </h2>

        {/* Review Summary */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-8 border-b border-border mb-8">
          <div className="text-center md:min-w-[120px]">
            <p className="text-5xl font-bold text-foreground mb-2">{rating}</p>
            <div className="flex justify-center mb-2">
              <StarRating rating={rating} size="md" />
            </div>
            <p className="text-sm text-muted-foreground">
              {reviewCount} reviews
            </p>
          </div>

          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                percentage={ratingDistribution[star] || 0}
              />
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>

        <Button variant="outline" className="mt-8 w-full">
          Load More Reviews
        </Button>
      </CardContent>
    </Card>
  );
};
