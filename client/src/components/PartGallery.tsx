import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Images } from 'lucide-react';
import ImageZoom from './ImageZoom';

interface PartVariant {
  id: string;
  name: string;
  image: string;
  dominantColor: string;
  shouldRotate?: boolean;
}

interface PartGalleryProps {
  partName: string;
  variants: PartVariant[];
  selectedVariant: string | null;
  onSelectVariant: (variantId: string) => void;
}

export default function PartGallery({ partName, variants, selectedVariant, onSelectVariant }: PartGalleryProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handleNavigate = (index: number) => {
    setZoomIndex(index);
  };

  const zoomImages = variants.map(v => ({ 
    src: v.image, 
    name: v.name,
    shouldRotate: v.shouldRotate
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground" data-testid={`heading-${partName.toLowerCase()}`}>
          {partName}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setZoomIndex(0);
            setZoomOpen(true);
          }}
          title="Zobrazit galerii"
        >
          <Images className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {variants.map((variant, index) => (
          <Card
            key={variant.id}
            className={`p-2 cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedVariant === variant.id 
                ? 'ring-4 ring-primary' 
                : ''
            }`}
            onClick={() => {
              onSelectVariant(variant.id);
            }}
            data-testid={`card-variant-${variant.id}`}
          >
            <div className="aspect-square bg-muted rounded-md mb-2 relative group overflow-hidden">
              <div className="absolute inset-0 rounded-md overflow-hidden">
                <img 
                  src={variant.image} 
                  alt={variant.name}
                  className={`w-full h-full object-cover ${variant.shouldRotate ? 'rotate-90' : ''}`}
                  data-testid={`img-variant-${variant.id}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm border"
                style={{ backgroundColor: variant.dominantColor }}
              />
              <p className="text-xs font-medium truncate">{variant.name}</p>
            </div>
          </Card>
        ))}
      </div>

      <ImageZoom
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        imageSrc={zoomImages[zoomIndex]?.src || ''}
        imageName={`${partName} - ${zoomImages[zoomIndex]?.name || ''}`}
        images={zoomImages}
        currentIndex={zoomIndex}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
