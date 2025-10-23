import { useState } from 'react';
import { Button } from '@/components/ui/button';
import KrojViewer from '@/components/KrojViewer';
import PartGallery from '@/components/PartGallery';
import ValidationDialog from '@/components/ValidationDialog';
import { extractDominantColor, colorToString } from '@/lib/colorExtractor';
import { useToast } from '@/hooks/use-toast';


type PartId = 'sukne' | 'fjertuch' | 'satek' | 'pantle';

interface PartVariant {
  id: string;
  name: string;
  image: string;
  dominantColor: string;
}

const variants: Record<PartId, PartVariant[]> = {
  sukne: [
    { id: 'sukne_bila', name: 'Bílá', image: '/kroje/sukne_bila.jpeg', dominantColor: '#ffffff' },
    { id: 'sukne_cervena', name: 'Červená', image: '/kroje/sukne_cervena.jpeg', dominantColor: '#dc2626' },
    { id: 'sukne_zluta', name: 'Žlutá', image: '/kroje/sukne_zluta.jpeg', dominantColor: '#eab308' },
  ],
  fjertuch: [
    { id: 'fjertuch_barevna', name: 'Barevný', image: '/kroje/fjertuch_barevna.jpeg', dominantColor: '#a855f7' },
    { id: 'fjertuch_barevna_2', name: 'Barevný 2', image: '/kroje/fjertuch_barevna_2.jpeg', dominantColor: '#ec4899' },
    { id: 'fjertuch_cervena', name: 'Červený', image: '/kroje/fjertuch_cervena.jpeg', dominantColor: '#dc2626' },
    { id: 'fjertuch_fialova', name: 'Fialový', image: '/kroje/fjertuch_fialova.jpeg', dominantColor: '#a855f7' },
    { id: 'fjertuch_fialova_2', name: 'Fialový 2', image: '/kroje/fjertuch_fialova_2.jpeg', dominantColor: '#9333ea' },
    { id: 'fjertuch_hneda', name: 'Hnědý', image: '/kroje/fjertuch_hneda.jpeg', dominantColor: '#92400e' },
    { id: 'fjertuch_modra', name: 'Modrý', image: '/kroje/fjertuch_modra.jpeg', dominantColor: '#3b82f6' },
    { id: 'fjertuch_ruzova', name: 'Růžový', image: '/kroje/fjertuch_ruzova.jpeg', dominantColor: '#ec4899' },
    { id: 'fjertuch_ruzova_2', name: 'Růžový 2', image: '/kroje/fjertuch_ruzova_2.jpeg', dominantColor: '#db2777' },
    { id: 'fjertuch_ruzova_3', name: 'Růžový 3', image: '/kroje/fjertuch_ruzova_3.jpeg', dominantColor: '#be185d' },
    { id: 'fjertuch_zelena', name: 'Zelený', image: '/kroje/fjertuch_zelena.jpeg', dominantColor: '#22c55e' },
    { id: 'fjertuch_zelena_2', name: 'Zelený 2', image: '/kroje/fjertuch_zelena_2.jpeg', dominantColor: '#16a34a' },
    { id: 'fjertuch_zelena_3', name: 'Zelený 3', image: '/kroje/fjertuch_zelena_3.jpeg', dominantColor: '#15803d' },
  ],
  satek: [
    { id: 'satek_bila', name: 'Bílý', image: '/kroje/satek_bila.jpeg', dominantColor: '#ffffff' },
    { id: 'satek_cervena', name: 'Červený', image: '/kroje/satek_cervena.jpeg', dominantColor: '#dc2626' },
    { id: 'satek_modra', name: 'Modrý', image: '/kroje/satek_modra.jpeg', dominantColor: '#3b82f6' },
    { id: 'satek_modra_2', name: 'Modrý 2', image: '/kroje/satek_modra_2.jpeg', dominantColor: '#2563eb' },
    { id: 'satek_ruzova', name: 'Růžový', image: '/kroje/satek_ruzova.jpeg', dominantColor: '#ec4899' },
    { id: 'satek_zelena', name: 'Zelený', image: '/kroje/satek_zelena.jpeg', dominantColor: '#22c55e' },
  ],
  pantle: [
    { id: 'pantle_bila', name: 'Bílé', image: '/kroje/pantle_bila.jpeg', dominantColor: '#ffffff' },
    { id: 'pantle_cervena', name: 'Červené', image: '/kroje/pantle_cervena.jpeg', dominantColor: '#dc2626' },
    { id: 'pantle_modra', name: 'Modré', image: '/kroje/pantle_modra.jpeg', dominantColor: '#3b82f6' },
    { id: 'pantle_zelena', name: 'Zelené', image: '/kroje/pantle_zelena.jpeg', dominantColor: '#22c55e' },
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
      try {
        const dominantColor = await extractDominantColor(variant.image);
        setColors(prev => ({ ...prev, [partId]: dominantColor }));
      } catch (error) {
        setColors(prev => ({ ...prev, [partId]: variant.dominantColor }));
      }
    }

    toast({
      title: 'Varianta vybrána',
      description: `${variant?.name} - ${partId}`,
    });
  };

  const validateCombination = async () => {
    const allSelected = Object.values(selections).every(s => s !== null);
    
    if (!allSelected) {
      setValidationResult({
        isValid: false,
        message: 'Nejdříve vyberte všechny části kroje (sukně, fjertuch, šátek i pantle).'
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
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground" data-testid="heading-main">
            Sestavte si Chodský Kroj
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Vyberte barevné kombinace jednotlivých částí tradičního kroje
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <KrojViewer 
              onPartClick={handlePartClick}
              selectedPart={selectedPart}
              colors={colors}
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

          <div className="space-y-12">
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
                partName="Pantle"
                variants={variants.pantle}
                selectedVariant={selections.pantle}
                onSelectVariant={(id) => handleSelectVariant('pantle', id)}
              />
            </div>
          </div>
        </div>
      </main>

      <ValidationDialog 
        open={showValidation}
        onOpenChange={setShowValidation}
        isValid={validationResult.isValid}
        message={validationResult.message}
      />
    </div>
  );
}
