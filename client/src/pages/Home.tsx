import { useState } from 'react';
import { Button } from '@/components/ui/button';
import KrojViewer from '@/components/KrojViewer';
import PartGallery from '@/components/PartGallery';
import ValidationDialog from '@/components/ValidationDialog';
import { extractDominantColor, colorToString } from '@/lib/colorExtractor';
import { useToast } from '@/hooks/use-toast';
import { getAssetPath } from '@/lib/utils';


type PartId = 'sukne' | 'fjertuch' | 'satek' | 'pantle';

interface PartVariant {
  id: string;
  name: string;
  image: string;
  dominantColor: string;
  shouldRotate?: boolean;
}

const partDisplayNames: Record<PartId, string> = {
  sukne: 'Sukně',
  fjertuch: 'Fjertuch',
  satek: 'Šátek',
  pantle: 'Pantl',
};

const variants: Record<PartId, PartVariant[]> = {
  sukne: [
    { id: 'sukne_bila', name: 'Bílá', image: getAssetPath('/kroje/sukne_bila.jpeg'), dominantColor: '#ffffff' },
    { id: 'sukne_cervena', name: 'Červená', image: getAssetPath('/kroje/sukne_cervena.jpeg'), dominantColor: '#dc2626' },
    { id: 'sukne_zluta', name: 'Žlutá', image: getAssetPath('/kroje/sukne_zluta.jpeg'), dominantColor: '#eab308' },
  ],
  fjertuch: [
    { id: 'fjertuch_barevna', name: 'Barevný', image: getAssetPath('/kroje/fjertuch_barevna.jpeg'), dominantColor: '#a855f7' },
    { id: 'fjertuch_barevna_2', name: 'Barevný 2', image: getAssetPath('/kroje/fjertuch_barevna_2.jpeg'), dominantColor: '#ec4899' },
    { id: 'fjertuch_cervena', name: 'Červený', image: getAssetPath('/kroje/fjertuch_cervena.jpeg'), dominantColor: '#dc2626' },
    { id: 'fjertuch_fialova', name: 'Fialový', image: getAssetPath('/kroje/fjertuch_fialova.jpeg'), dominantColor: '#a855f7' },
    { id: 'fjertuch_fialova_2', name: 'Fialový 2', image: getAssetPath('/kroje/fjertuch_fialova_2.jpeg'), dominantColor: '#9333ea' },
    { id: 'fjertuch_hneda', name: 'Hnědý', image: getAssetPath('/kroje/fjertuch_hneda.jpeg'), dominantColor: '#92400e' },
    { id: 'fjertuch_modra', name: 'Modrý', image: getAssetPath('/kroje/fjertuch_modra.jpeg'), dominantColor: '#3b82f6' },
    { id: 'fjertuch_ruzova', name: 'Růžový', image: getAssetPath('/kroje/fjertuch_ruzova.jpeg'), dominantColor: '#ec4899' },
    // { id: 'fjertuch_ruzova_2', name: 'Růžový 2', image: getAssetPath('/kroje/fjertuch_ruzova_2.jpeg'), dominantColor: '#db2777' },
    { id: 'fjertuch_ruzova_3', name: 'Růžový 3', image: getAssetPath('/kroje/fjertuch_ruzova_3.jpeg'), dominantColor: '#be185d' },
    { id: 'fjertuch_zelena', name: 'Zelený', image: getAssetPath('/kroje/fjertuch_zelena.jpeg'), dominantColor: '#22c55e' },
    // { id: 'fjertuch_zelena_2', name: 'Zelený 2', image: getAssetPath('/kroje/fjertuch_zelena_2.jpeg'), dominantColor: '#16a34a' },
    { id: 'fjertuch_zelena_3', name: 'Zelený 3', image: getAssetPath('/kroje/fjertuch_zelena_3.jpeg'), dominantColor: '#15803d' },
  ],
  satek: [
    // White, blue, dark blue, pink, green
    { id: 'satek_bila', name: 'Bílý', image: getAssetPath('/kroje/satek_bila.jpeg'), dominantColor: '#ffffff' },
    { id: 'satek_modra', name: 'Modrý', image: getAssetPath('/kroje/satek_modra.jpeg'), dominantColor: '#0ea5e9' },
    { id: 'satek_modra_2', name: 'Modrý (tmavý)', image: getAssetPath('/kroje/satek_modra_2.jpeg'), dominantColor: '#1e40af' },
    { id: 'satek_ruzova', name: 'Růžový', image: getAssetPath('/kroje/satek_ruzova.jpeg'), dominantColor: '#ec4899' },
    { id: 'satek_zelena', name: 'Zelený', image: getAssetPath('/kroje/satek_zelena.jpeg'), dominantColor: '#0d9488' },
  ],
  pantle: [
    { id: 'pantle_bila', name: 'Bílé', image: getAssetPath('/kroje/pantle_bila.jpeg'), dominantColor: '#ffffff' },
    { id: 'pantle_cervena', name: 'Červené', image: getAssetPath('/kroje/pantle_cervena.jpeg'), dominantColor: '#dc2626' },
    { id: 'pantle_modra', name: 'Modré', image: getAssetPath('/kroje/pantle_modra.jpeg'), dominantColor: '#3b82f6' },
    { id: 'pantle_zelena', name: 'Zelené', image: getAssetPath('/kroje/pantle_zelena.jpeg'), dominantColor: '#22c55e' },
  ],
};

export default function Home() {
  const [selectedPart, setSelectedPart] = useState<PartId | null>(null);
  const [selections, setSelections] = useState<Record<PartId, string | null>>({
    sukne: null,
    fjertuch: null,
    satek: null,
    pantle: null,
  });
  const [colors, setColors] = useState<Record<string, string>>({});
  const [textures, setTextures] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState({ isValid: false, message: '' });
  const { toast } = useToast();

  const handlePartClick = (partId: PartId) => {
    setSelectedPart(partId);
    const element = document.getElementById(`gallery-${partId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSelectVariant = async (partId: PartId, variantId: string) => {
    setSelections(prev => ({ ...prev, [partId]: variantId }));
    
    const variant = variants[partId].find(v => v.id === variantId);
    if (variant) {
      // Pro sukni, fjertuch a pantle použij texturu, jinak barvu
      if (partId === 'sukne' || partId === 'fjertuch' || partId === 'pantle') {
        setTextures(prev => ({ ...prev, [partId]: variant.image }));
        setColors(prev => ({ ...prev, [partId]: variant.dominantColor }));
      } else {
        setColors(prev => ({ ...prev, [partId]: variant.dominantColor }));
      }
    }

    toast({
      title: 'Varianta vybrána',
      description: `${variant?.name} - ${partDisplayNames[partId]}`,
      action: (
        <Button
          size="sm"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Zobrazit
        </Button>
      ),
    });
  };

  const validateCombination = async () => {
    const allSelected = Object.values(selections).every(s => s !== null);
    
    if (!allSelected) {
      setValidationResult({
        isValid: false,
        message: 'Nejdříve vyberte všechny části kroje (sukně, fjertuch, šátek i pantl).'
      });
      setShowValidation(true);
      return;
    }

    try {
      const response = await fetch('/kroj-config.json');
      const config = await response.json();
      
      const colorNames: Record<PartId, string> = {
        sukne: colorToString(colors.sukne || ''),
        fjertuch: colorToString(colors.fjertuch || ''),
        satek: colorToString(colors.satek || ''),
        pantle: colorToString(colors.pantle || ''),
      };

      const isValid = config.validationRules.allowedCombinations.some((combo: any) => 
        combo.sukne === colorNames.sukne &&
        combo.fjertuch === colorNames.fjertuch &&
        combo.satek === colorNames.satek &&
        combo.pantle === colorNames.pantle
      );

      const messages = isValid ? config.messages.success : config.messages.error;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      setValidationResult({ isValid, message: randomMessage });
      setShowValidation(true);
    } catch (error) {
      console.error('Error loading config:', error);
      setValidationResult({
        isValid: false,
        message: 'Chyba při načítání pravidel. Zkuste to znovu.'
      });
      setShowValidation(true);
    }
  };

  return (
        <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 py-1 md:px-4 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex-1 md:flex-none text-center md:text-center">
              <h1 className="text-lg md:text-3xl lg:text-4xl font-serif font-bold text-foreground leading-tight" data-testid="heading-main">
                Sestav si chodský kroj
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0 md:mt-2">
                Víš, které barvy k sobě patří?
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <a 
                href="https://postrekovo.cz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <img 
                  src={getAssetPath('/nsp.jpg')}
                  alt="Národopisný soubor Postřekov" 
                  className="h-9 md:h-14 lg:h-16 w-auto object-contain"
                />
              </a>
              <a 
                href="https://www.obecpostrekov.cz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <img 
                  src={getAssetPath('/obec_postrekov.jpg')}
                  alt="Obec Postřekov" 
                  className="h-9 md:h-14 lg:h-16 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-2 md:py-8">
        <div className="grid lg:grid-cols-[auto_1fr] gap-2 md:gap-8 items-start">
          <div className="lg:sticky lg:top-24 w-full lg:w-auto">
            <div className="max-w-md lg:max-w-none lg:max-h-[calc(100vh-8rem)] flex flex-col">
              <KrojViewer 
                onPartClick={handlePartClick}
                selectedPart={selectedPart}
                colors={colors}
                textures={textures}
              />
              
              <Button 
                size="lg"
                className="w-full mt-6 text-lg"
                onClick={validateCombination}
                data-testid="button-validate"
              >
                Vyhodnotit kombinaci
              </Button>
            </div>
          </div>

          <div className="space-y-12 pb-12 flex-1">
            <div id="gallery-satek">
              <PartGallery 
                partName="Šátek"
                variants={variants.satek}
                selectedVariant={selections.satek}
                onSelectVariant={(id) => handleSelectVariant('satek', id)}
              />
            </div>

            <div id="gallery-pantle">
              <PartGallery 
                partName="Pantl"
                variants={variants.pantle}
                selectedVariant={selections.pantle}
                onSelectVariant={(id) => handleSelectVariant('pantle', id)}
              />
            </div>

            <div id="gallery-sukne">
              <PartGallery 
                partName="Sukně"
                variants={variants.sukne}
                selectedVariant={selections.sukne}
                onSelectVariant={(id) => handleSelectVariant('sukne', id)}
              />
            </div>

            <div id="gallery-fjertuch">
              <PartGallery 
                partName="Fjertuch"
                variants={variants.fjertuch}
                selectedVariant={selections.fjertuch}
                onSelectVariant={(id) => handleSelectVariant('fjertuch', id)}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card/30">
        <div className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
          Copyright: <a href="https://postrekovo.cz/" target="_blank" rel="noopener noreferrer" className="hover:underline">Národopisný soubor Postřekov</a> © 2024, <a href="http://jiribubnik.cz/" target="_blank" rel="noopener noreferrer" className="hover:underline">Jiří Bubník</a>
        </div>
      </footer>

      <ValidationDialog 
        open={showValidation}
        onOpenChange={setShowValidation}
        isValid={validationResult.isValid}
        message={validationResult.message}
      />
    </div>
  );
}
