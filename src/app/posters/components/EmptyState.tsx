import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-4">
    <div className="rounded-full bg-muted/50 p-4 sm:p-6 mb-4 sm:mb-6">
      <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
    </div>
    <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
      No posters found
    </h3>
    <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md text-base sm:text-lg">
      We couldn&apos;t find any posters matching your criteria. Try adjusting
      your filters.
    </p>
    <Button onClick={onClear} variant="outline" size="lg" className="px-8">
      Clear All Filters
    </Button>
  </div>
);
