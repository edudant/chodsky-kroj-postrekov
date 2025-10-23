export function extractDominantColor(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#888888');
        return;
      }

      const scale = Math.min(200 / img.width, 200 / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const colorCounts: { [key: string]: number } = {};
      
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 200) continue;
        
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r > 240 && g > 240 && b > 240) continue;
        if (r < 30 && g < 30 && b < 30) continue;
        
        const rBucket = Math.floor(r / 40) * 40;
        const gBucket = Math.floor(g / 40) * 40;
        const bBucket = Math.floor(b / 40) * 40;
        
        const key = `${rBucket},${gBucket},${bBucket}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }

      let maxCount = 0;
      let dominantColor = '#888888';
      
      for (const [color, count] of Object.entries(colorCounts)) {
        if (count > maxCount) {
          maxCount = count;
          const [r, g, b] = color.split(',').map(Number);
          dominantColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }
      }

      resolve(dominantColor);
    };

    img.onerror = () => {
      resolve('#888888');
    };

    img.src = imageSrc;
  });
}

export function colorToString(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return 'unknown';

  const { r, g, b } = rgb;
  
  if (r > 230 && g > 230 && b > 230) return 'white';
  
  if (r > 180 && g < 100 && b < 100) return 'red';
  
  if (r > 180 && g > 150 && b < 120) return 'yellow';
  
  if (r < 120 && g > 150 && b < 120) return 'green';
  
  if (r < 120 && g < 120 && b > 180) return 'blue';
  
  if (r > 150 && g < 150 && b > 150) return 'purple';
  
  if (r > 180 && g < 150 && b > 120) return 'pink';
  
  if (r > 100 && g > 50 && b < 80) return 'brown';
  
  const maxComponent = Math.max(r, g, b);
  const minComponent = Math.min(r, g, b);
  const saturation = maxComponent > 0 ? (maxComponent - minComponent) / maxComponent : 0;
  
  if (saturation > 0.3 && Math.abs(r - g) < 60 && Math.abs(g - b) < 60) {
    return 'colorful';
  }
  
  if (saturation < 0.2) {
    return r > 150 ? 'white' : 'gray';
  }

  return 'colorful';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
