import PartGallery from '../PartGallery';

export default function PartGalleryExample() {
  const variants = [
    { id: 'sukne_bila', name: 'Bílá', image: '/kroje/sukne_bila.jpeg', dominantColor: '#ffffff' },
    { id: 'sukne_cervena', name: 'Červená', image: '/kroje/sukne_cervena.jpeg', dominantColor: '#dc2626' },
    { id: 'sukne_zluta', name: 'Žlutá', image: '/kroje/sukne_zluta.jpeg', dominantColor: '#eab308' },
  ];

  return (
    <PartGallery 
      partName="Sukně"
      variants={variants}
      selectedVariant="sukne_cervena"
      onSelectVariant={(id) => console.log('Selected:', id)}
    />
  );
}
