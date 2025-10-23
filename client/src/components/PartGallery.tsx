import { Card } from '@/components/ui/card';

interface PartVariant {
  id: string;
  name: string;
  image: string;
  dominantColor: string;
}

interface PartGalleryProps {
  partName: string;
  variants: PartVariant[];
  selectedVariant: string | null;
  onSelectVariant: (variantId: string) => void;
}

export default function PartGallery({ partName, variants, selectedVariant, onSelectVariant }: PartGalleryProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground" data-testid={`heading-${partName.toLowerCase()}`}>
          {partName}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Vyberte barevnou variantu
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {variants.map((variant) => (
          <Card
            key={variant.id}
            className={`p-2 cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedVariant === variant.id 
                ? 'ring-4 ring-primary' 
                : ''
            }`}
            onClick={() => {
              onSelectVariant(variant.id);
              console.log('Selected variant:', variant.name);
            }}
            data-testid={`card-variant-${variant.id}`}
          >
            <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
              <img 
                src={variant.image} 
                alt={variant.name}
                className="w-full h-full object-cover"
                data-testid={`img-variant-${variant.id}`}
              />
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
    </div>
  );
}
