import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import KrojViewer from '@/components/KrojViewer';
import PartGallery from '@/components/PartGallery';
import ValidationDialog from '@/components/ValidationDialog';
import { extractDominantColor, colorToString } from '@/lib/colorExtractor';
import { useToast } from '@/hooks/use-toast';

import mainKrojImage from '@assets/generated_images/Complete_Chodsky_kroj_costume_13ff6bfe.png';

import redSkirt from '@assets/generated_images/Red_folk_skirt_sukne_48d80be5.png';
import whiteSkirt from '@assets/generated_images/White_folk_skirt_sukne_8fe64c83.png';
import yellowSkirt from '@assets/generated_images/Yellow_folk_skirt_sukne_93045108.png';

import blueApron from '@assets/generated_images/Blue_folk_apron_fjertuch_97f199e3.png';
import colorfulApron from '@assets/generated_images/Colorful_folk_apron_fjertuch_91108a22.png';
import pinkApron from '@assets/generated_images/Pink_folk_apron_fjertuch_49f709eb.png';
import greenApron from '@assets/generated_images/Green_folk_apron_fjertuch_78ba503e.png';

import redScarf from '@assets/generated_images/Red_folk_headscarf_satek_fecc55f0.png';
import whiteScarf from '@assets/generated_images/White_folk_headscarf_satek_c58a89c2.png';
import blueScarf from '@assets/generated_images/Blue_folk_headscarf_satek_aa461409.png';

import greenRibbons from '@assets/generated_images/Green_folk_ribbons_pantle_6f42c6a1.png';
import redRibbons from '@assets/generated_images/Red_folk_ribbons_pantle_8fc02f54.png';
import blueRibbons from '@assets/generated_images/Blue_folk_ribbons_pantle_90325cae.png';

type PartId = 'sukne' | 'fjertuch' | 'satek' | 'pantle';

interface PartVariant {
  id: string;
  name: string;
  image: string;
  dominantColor: string;
}

const variants: Record<PartId, PartVariant[]> = {
  sukne: [
    { id: 'sukne_red', name: 'Červená', image: redSkirt, dominantColor: '#dc2626' },
    { id: 'sukne_white', name: 'Bílá', image: whiteSkirt, dominantColor: '#ffffff' },
    { id: 'sukne_yellow', name: 'Žlutá', image: yellowSkirt, dominantColor: '#eab308' },
  ],
  fjertuch: [
    { id: 'fjertuch_blue', name: 'Modrý', image: blueApron, dominantColor: '#3b82f6' },
    { id: 'fjertuch_colorful', name: 'Barevný', image: colorfulApron, dominantColor: '#a855f7' },
    { id: 'fjertuch_pink', name: 'Růžový', image: pinkApron, dominantColor: '#ec4899' },
    { id: 'fjertuch_green', name: 'Zelený', image: greenApron, dominantColor: '#22c55e' },
  ],
  satek: [
    { id: 'satek_red', name: 'Červený', image: redScarf, dominantColor: '#dc2626' },
    { id: 'satek_white', name: 'Bílý', image: whiteScarf, dominantColor: '#ffffff' },
    { id: 'satek_blue', name: 'Modrý', image: blueScarf, dominantColor: '#3b82f6' },
  ],
  pantle: [
    { id: 'pantle_green', name: 'Zelené', image: greenRibbons, dominantColor: '#22c55e' },
    { id: 'pantle_red', name: 'Červené', image: redRibbons, dominantColor: '#dc2626' },
    { id: 'pantle_blue', name: 'Modré', image: blueRibbons, dominantColor: '#3b82f6' },
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
              mainImage={mainKrojImage}
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
