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

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha > 200) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }

      if (count === 0) {
        resolve('#888888');
        return;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      resolve(hex);
    };

    img.onerror = () => {
      resolve('#888888');
    };

    img.src = imageSrc;
  });
}

export function colorToString(color: string): string {
  const colorMap: Record<string, string> = {
    '#dc2626': 'red',
    '#ef4444': 'red',
    '#b91c1c': 'red',
    '#ffffff': 'white',
    '#f9fafb': 'white',
    '#fafafa': 'white',
    '#eab308': 'yellow',
    '#fbbf24': 'yellow',
    '#f59e0b': 'yellow',
    '#3b82f6': 'blue',
    '#2563eb': 'blue',
    '#1d4ed8': 'blue',
    '#22c55e': 'green',
    '#16a34a': 'green',
    '#15803d': 'green',
    '#ec4899': 'pink',
    '#db2777': 'pink',
    '#be185d': 'pink',
    '#a855f7': 'purple',
    '#9333ea': 'purple',
    '#7c3aed': 'purple',
  };

  const normalizedColor = color.toLowerCase();
  
  for (const [hex, name] of Object.entries(colorMap)) {
    if (normalizedColor.includes(hex)) {
      return name;
    }
  }

  const rgb = hexToRgb(color);
  if (!rgb) return 'unknown';

  if (rgb.r > 200 && rgb.g < 100 && rgb.b < 100) return 'red';
  if (rgb.r > 200 && rgb.g > 200 && rgb.b < 100) return 'yellow';
  if (rgb.r < 100 && rgb.g > 150 && rgb.b < 100) return 'green';
  if (rgb.r < 100 && rgb.g < 100 && rgb.b > 200) return 'blue';
  if (rgb.r > 200 && rgb.g < 150 && rgb.b > 150) return 'pink';
  if (rgb.r > 230 && rgb.g > 230 && rgb.b > 230) return 'white';
  if (rgb.r > 100 && rgb.g > 100 && rgb.b > 150) return 'colorful';

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
