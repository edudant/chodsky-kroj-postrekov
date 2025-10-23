import PartGallery from '../PartGallery';
import redSkirt from '@assets/generated_images/Red_folk_skirt_sukne_48d80be5.png';
import whiteSkirt from '@assets/generated_images/White_folk_skirt_sukne_8fe64c83.png';
import yellowSkirt from '@assets/generated_images/Yellow_folk_skirt_sukne_93045108.png';

export default function PartGalleryExample() {
  const variants = [
    { id: 'sukne_red', name: 'Červená', image: redSkirt, dominantColor: '#dc2626' },
    { id: 'sukne_white', name: 'Bílá', image: whiteSkirt, dominantColor: '#ffffff' },
    { id: 'sukne_yellow', name: 'Žlutá', image: yellowSkirt, dominantColor: '#eab308' },
  ];

  return (
    <PartGallery 
      partName="Sukně"
      variants={variants}
      selectedVariant="sukne_red"
      onSelectVariant={(id) => console.log('Selected:', id)}
    />
  );
}
