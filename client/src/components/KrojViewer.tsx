import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { replaceColors, replaceWithTexture } from '@/lib/colorReplacer';
import { getAssetPath } from '@/lib/utils';

type PartId = 'sukne' | 'fjertuch' | 'satek' | 'pantle';

interface KrojViewerProps {
  onPartClick: (partId: PartId) => void;
  selectedPart: PartId | null;
  colors: Record<string, string>;
  textures?: Record<string, string>; // URL obrázků pro textury
}

export default function KrojViewer({ onPartClick, selectedPart, colors, textures }: KrojViewerProps) {
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const textureImagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = getAssetPath('/kroj-sablona.jpg');
    img.onload = () => {
      sourceImageRef.current = img;
      setProcessedImage(img.src);
      setIsLoading(false);
    };
  }, []);

  // Načti textury a aplikuj je; poté aplikuj barvy na části bez textur
  useEffect(() => {
    if (!sourceImageRef.current || isLoading) return;
    
    const hasAnyTexture = textures && Object.values(textures).some(t => t);
    const hasAnyColor = Object.values(colors).some(c => c);
    
    if (!hasAnyTexture && !hasAnyColor) {
      setProcessedImage(sourceImageRef.current.src);
      return;
    }

    const processImage = async () => {
      // Načti textury pokud jsou
      if (hasAnyTexture) {
        const loaded: Record<string, HTMLImageElement> = {};
        
        for (const [key, url] of Object.entries(textures || {})) {
          if (url) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = url;
            });
            loaded[key] = img;
          }
        }
        
        // Aplikuj textury
        if (Object.keys(loaded).length > 0) {
          const texturedDataUrl = await replaceWithTexture(sourceImageRef.current!, loaded);
          if (texturedDataUrl) {
            // Pokud jsou i barvy, aplikuj je pouze na části bez textur (např. šátek)
            const colorsForNonTexturedParts = Object.fromEntries(
              Object.entries(colors).filter(([k, v]) => v && !textures?.[k as keyof typeof textures])
            );

            if (Object.keys(colorsForNonTexturedParts).length > 0) {
              const imgAfterTexture = new Image();
              imgAfterTexture.crossOrigin = 'anonymous';
              await new Promise((resolve, reject) => {
                imgAfterTexture.onload = resolve;
                imgAfterTexture.onerror = reject;
                imgAfterTexture.src = texturedDataUrl;
              });
              const finalDataUrl = await replaceColors(imgAfterTexture, colorsForNonTexturedParts);
              if (finalDataUrl) {
                setProcessedImage(finalDataUrl);
                return;
              }
            }

            // Pokud nejsou žádné barvy k aplikaci, nebo selže další krok, ponech texturovaný výsledek
            setProcessedImage(texturedDataUrl);
            return;
          }
        }
      } else if (hasAnyColor) {
        // Použij barvy pokud nejsou textury
        const dataUrl = await replaceColors(sourceImageRef.current!, colors);
        if (dataUrl) {
          setProcessedImage(dataUrl);
        }
      }
    };
    
    processImage();
  }, [colors, textures, isLoading]);

  return (
    <Card className="p-4 bg-white border w-full lg:w-auto">
      <div className="relative bg-white rounded-md">
        <img 
          src={processedImage}
          alt="Chodský kroj"
          className="w-full h-auto max-h-[60vh] lg:max-h-[calc(100vh-16rem)] object-contain rounded-md"
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
    </Card>
  );
}
