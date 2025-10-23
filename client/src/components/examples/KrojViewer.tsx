import KrojViewer from '../KrojViewer';
import mainKrojImage from '@assets/generated_images/Complete_Chodsky_kroj_costume_13ff6bfe.png';

export default function KrojViewerExample() {
  return (
    <KrojViewer 
      onPartClick={(partId) => console.log('Part clicked:', partId)}
      selectedPart="fjertuch"
      colors={{
        sukne: '#dc2626',
        fjertuch: '#3b82f6',
        satek: '#ffffff',
        pantle: '#22c55e'
      }}
      mainImage={mainKrojImage}
    />
  );
}
