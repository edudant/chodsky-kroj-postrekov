import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { replaceColors } from '@/lib/colorReplacer';

type PartId = 'sukne' | 'fjertuch' | 'satek' | 'pantle';

interface KrojViewerProps {
  onPartClick: (partId: PartId) => void;
  selectedPart: PartId | null;
  colors: Record<string, string>;
}

export default function KrojViewer({ onPartClick, selectedPart, colors }: KrojViewerProps) {
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/kroj-sablona.jpg';
    img.onload = () => {
      sourceImageRef.current = img;
      setProcessedImage(img.src);
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    if (!sourceImageRef.current || isLoading) return;
    
    const hasAnyColor = Object.values(colors).some(c => c);
    if (!hasAnyColor) {
      setProcessedImage(sourceImageRef.current.src);
      return;
    }

    replaceColors(sourceImageRef.current, colors).then(dataUrl => {
      if (dataUrl) {
        setProcessedImage(dataUrl);
      }
    });
  }, [colors, isLoading]);

  return (
    <Card className="p-4 bg-card">
      <div className="relative max-w-md mx-auto">
        <img 
          src={processedImage}
          alt="Chodský kroj"
          className="w-full h-auto rounded-md"
          data-testid="img-main-kroj"
        />
        
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 1000 1400"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect 
            x="50" y="850" width="200" height="400"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('sukne')}
            data-testid="region-sukne"
          />
          
          <rect 
            x="300" y="700" width="450" height="550"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('fjertuch')}
            data-testid="region-fjertuch"
          />
          
          <rect 
            x="250" y="100" width="500" height="400"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('satek')}
            data-testid="region-satek"
          />
          
          <rect 
            x="620" y="550" width="80" height="100"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('pantle')}
            data-testid="region-pantle-right"
          />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: colors.sukne || '#ccc' }}></div>
          <span className={selectedPart === 'sukne' ? 'font-bold text-primary' : ''}>Sukně</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: colors.fjertuch || '#ccc' }}></div>
          <span className={selectedPart === 'fjertuch' ? 'font-bold text-primary' : ''}>Fjertuch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: colors.satek || '#ccc' }}></div>
          <span className={selectedPart === 'satek' ? 'font-bold text-primary' : ''}>Šátek</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: colors.pantle || '#ccc' }}></div>
          <span className={selectedPart === 'pantle' ? 'font-bold text-primary' : ''}>Pantl</span>
        </div>
      </div>
    </Card>
  );
}
