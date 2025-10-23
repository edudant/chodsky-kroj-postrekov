import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface KrojPart {
  id: 'sukne' | 'fjertuch' | 'satek' | 'pantle';
  name: string;
  color?: string;
}

interface KrojViewerProps {
  onPartClick: (partId: KrojPart['id']) => void;
  selectedPart: KrojPart['id'] | null;
  colors: Record<string, string>;
  mainImage: string;
}

export default function KrojViewer({ onPartClick, selectedPart, colors, mainImage }: KrojViewerProps) {
  const [hoveredPart, setHoveredPart] = useState<KrojPart['id'] | null>(null);

  const parts: KrojPart[] = [
    { id: 'satek', name: 'Šátek' },
    { id: 'fjertuch', name: 'Fjertuch' },
    { id: 'sukne', name: 'Sukně' },
    { id: 'pantle', name: 'Pantle' },
  ];

  return (
    <Card className="p-6">
      <div className="relative">
        <img 
          src={mainImage} 
          alt="Chodský kroj" 
          className="w-full h-auto rounded-md"
          data-testid="img-main-kroj"
        />
        
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Šátek - upper region */}
          <rect
            x="25"
            y="5"
            width="50"
            height="15"
            fill={colors.satek || 'transparent'}
            opacity={colors.satek ? 0.6 : hoveredPart === 'satek' ? 0.3 : 0}
            className="cursor-pointer transition-opacity duration-300"
            onClick={() => onPartClick('satek')}
            onMouseEnter={() => setHoveredPart('satek')}
            onMouseLeave={() => setHoveredPart(null)}
            stroke={selectedPart === 'satek' ? 'hsl(var(--primary))' : 'none'}
            strokeWidth={selectedPart === 'satek' ? '1' : '0'}
            data-testid="region-satek"
          />

          {/* Fjertuch - mid-upper region */}
          <rect
            x="30"
            y="35"
            width="40"
            height="35"
            fill={colors.fjertuch || 'transparent'}
            opacity={colors.fjertuch ? 0.6 : hoveredPart === 'fjertuch' ? 0.3 : 0}
            className="cursor-pointer transition-opacity duration-300"
            onClick={() => onPartClick('fjertuch')}
            onMouseEnter={() => setHoveredPart('fjertuch')}
            onMouseLeave={() => setHoveredPart(null)}
            stroke={selectedPart === 'fjertuch' ? 'hsl(var(--primary))' : 'none'}
            strokeWidth={selectedPart === 'fjertuch' ? '1' : '0'}
            data-testid="region-fjertuch"
          />

          {/* Sukně - lower region */}
          <rect
            x="20"
            y="70"
            width="60"
            height="28"
            fill={colors.sukne || 'transparent'}
            opacity={colors.sukne ? 0.6 : hoveredPart === 'sukne' ? 0.3 : 0}
            className="cursor-pointer transition-opacity duration-300"
            onClick={() => onPartClick('sukne')}
            onMouseEnter={() => setHoveredPart('sukne')}
            onMouseLeave={() => setHoveredPart(null)}
            stroke={selectedPart === 'sukne' ? 'hsl(var(--primary))' : 'none'}
            strokeWidth={selectedPart === 'sukne' ? '1' : '0'}
            data-testid="region-sukne"
          />

          {/* Pantle - mid-side regions */}
          <rect
            x="22"
            y="50"
            width="8"
            height="25"
            fill={colors.pantle || 'transparent'}
            opacity={colors.pantle ? 0.6 : hoveredPart === 'pantle' ? 0.3 : 0}
            className="cursor-pointer transition-opacity duration-300"
            onClick={() => onPartClick('pantle')}
            onMouseEnter={() => setHoveredPart('pantle')}
            onMouseLeave={() => setHoveredPart(null)}
            stroke={selectedPart === 'pantle' ? 'hsl(var(--primary))' : 'none'}
            strokeWidth={selectedPart === 'pantle' ? '1' : '0'}
            data-testid="region-pantle-left"
          />
          <rect
            x="70"
            y="50"
            width="8"
            height="25"
            fill={colors.pantle || 'transparent'}
            opacity={colors.pantle ? 0.6 : hoveredPart === 'pantle' ? 0.3 : 0}
            className="cursor-pointer transition-opacity duration-300"
            onClick={() => onPartClick('pantle')}
            onMouseEnter={() => setHoveredPart('pantle')}
            onMouseLeave={() => setHoveredPart(null)}
            stroke={selectedPart === 'pantle' ? 'hsl(var(--primary))' : 'none'}
            strokeWidth={selectedPart === 'pantle' ? '1' : '0'}
            data-testid="region-pantle-right"
          />
        </svg>

        {hoveredPart && (
          <div className="absolute top-2 left-2 bg-background/90 px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
            {parts.find(p => p.id === hoveredPart)?.name}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {parts.map(part => (
          <div 
            key={part.id}
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              selectedPart === part.id ? 'bg-primary/10 ring-2 ring-primary' : ''
            }`}
            data-testid={`indicator-${part.id}`}
          >
            <div 
              className="w-4 h-4 rounded-sm border-2"
              style={{ 
                backgroundColor: colors[part.id] || 'transparent',
                borderColor: colors[part.id] ? colors[part.id] : 'hsl(var(--border))'
              }}
            />
            <span className={colors[part.id] ? 'font-medium' : 'text-muted-foreground'}>
              {part.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
