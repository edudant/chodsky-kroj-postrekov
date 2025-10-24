import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageZoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  imageName: string;
  images?: { src: string; name: string; shouldRotate?: boolean }[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

export default function ImageZoom({
  open,
  onOpenChange,
  imageSrc,
  imageName,
  images,
  currentIndex,
  onNavigate,
}: ImageZoomProps) {
  const hasPrevious = images && currentIndex !== undefined && currentIndex > 0;
  const hasNext = images && currentIndex !== undefined && currentIndex < images.length - 1;

  const handlePrevious = () => {
    if (hasPrevious && onNavigate && currentIndex !== undefined) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate && currentIndex !== undefined) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl w-[95vw] h-[95vh] p-0 bg-background/95 backdrop-blur-sm flex flex-col"
        data-testid="dialog-image-zoom"
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-lg font-serif" data-testid="text-zoom-title">
            {imageName}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-zoom"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="relative flex-1 flex items-center justify-center min-h-0 p-12 overflow-hidden">
          <div className="flex items-center justify-center gap-4 w-full h-full max-w-full max-h-full">
            {hasPrevious && (
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full shadow-xl shrink-0"
                onClick={handlePrevious}
                data-testid="button-previous-image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            <div className="flex items-center justify-center flex-1 min-w-0 min-h-0 overflow-hidden">
              <img
                src={imageSrc}
                alt={imageName}
                className={`max-w-full max-h-full w-auto h-auto object-contain rounded-md shadow-lg ${
                  images && currentIndex !== undefined && images[currentIndex]?.shouldRotate
                    ? 'rotate-90'
                    : ''
                }`}
                data-testid="img-zoomed"
              />
            </div>

            {hasNext && (
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full shadow-xl shrink-0"
                onClick={handleNext}
                data-testid="button-next-image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        {images && currentIndex !== undefined && (
          <div className="px-6 py-3 border-t bg-muted/30 text-center text-sm text-muted-foreground shrink-0">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
