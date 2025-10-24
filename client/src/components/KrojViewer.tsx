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
          {/* Sukně - malý kousek vlevo */}
          <polygon 
            points="351,988 354,950 354,868 356,772 371,638 394,600 359,593 327,630 264,976"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('sukne')}
            data-testid="region-sukne"
          />
          
          {/* Fjertuch - zelená zástěra */}
          <polygon 
            points="389,599 364,629 349,754 349,796 351,863 339,1031 416,1051 531,1045 555,1040 722,1041 727,1027 869,1023 901,1012 861,772 822,661 822,627 799,583 650,575 598,541 570,594 553,599 508,587 429,603"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('fjertuch')}
            data-testid="region-fjertuch"
          />
          
          {/* Šátek - na hlavě */}
          <polygon 
            points="506,269 528,288 533,303 538,329 538,354 526,370 501,385 568,461 613,514 657,544 705,569 725,543 749,522 769,496 787,456 797,432 784,388 769,394 777,421 757,440 730,463 722,477 715,508 697,517 682,478 667,437 633,428 598,409 573,355 555,328 533,290"
            fill="transparent"
            className="cursor-pointer hover:fill-primary/10 transition-colors pointer-events-auto"
            onClick={() => onPartClick('satek')}
            data-testid="region-satek"
          />
          
          {/* Pantl - malý kousek nad rukou */}
          <polygon 
            points="441,514 431,536 456,545 478,535 521,529 523,520"
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
