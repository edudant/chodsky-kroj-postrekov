export interface ColorRange {
  hMin: number;
  hMax: number;
  sMin: number;
  sMax: number;
  lMin: number;
  lMax: number;
}

export interface KrojPart {
  name: string;
  originalColorRange: ColorRange;
}

export const krojParts: Record<string, KrojPart> = {
  satek: {
    name: 'Šátek',
    originalColorRange: {
      hMin: 20,
      hMax: 40,
      sMin: 10,
      sMax: 50,
      lMin: 50,
      lMax: 85,
    },
  },
  fjertuch: {
    name: 'Fjertuch',
    originalColorRange: {
      hMin: 80,
      hMax: 160,
      sMin: 20,
      sMax: 100,
      lMin: 15,
      lMax: 75,
    },
  },
  sukne: {
    name: 'Sukně',
    originalColorRange: {
      hMin: 340,
      hMax: 20,
      sMin: 30,
      sMax: 100,
      lMin: 20,
      lMax: 75,
    },
  },
  pantle: {
    name: 'Pantle',
    originalColorRange: {
      hMin: 45,
      hMax: 70,
      sMin: 55,
      sMax: 100,
      lMin: 40,
      lMax: 85,
    },
  },
};

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function isInColorRange(h: number, s: number, l: number, range: ColorRange): boolean {
  const { hMin, hMax, sMin, sMax, lMin, lMax } = range;
  
  let hInRange = false;
  if (hMin <= hMax) {
    hInRange = h >= hMin && h <= hMax;
  } else {
    hInRange = h >= hMin || h <= hMax;
  }
  
  return hInRange && s >= sMin && s <= sMax && l >= lMin && l <= lMax;
}

export function replaceColors(
  sourceImage: HTMLImageElement,
  colorReplacements: Record<string, string>
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) {
      resolve('');
      return;
    }

    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;
    
    ctx.drawImage(sourceImage, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const replacements: Array<{ range: ColorRange; targetHsl: [number, number, number] }> = [];
    
    for (const [partKey, hexColor] of Object.entries(colorReplacements)) {
      const part = krojParts[partKey];
      if (part && hexColor) {
        const rgb = hexToRgb(hexColor);
        if (rgb) {
          const targetHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          replacements.push({ range: part.originalColorRange, targetHsl });
        }
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      if (a === 0) continue;
      
      const [h, s, l] = rgbToHsl(r, g, b);
      
      for (const { range, targetHsl } of replacements) {
        if (isInColorRange(h, s, l, range)) {
          const normalizedL = (l - range.lMin) / (range.lMax - range.lMin);
          const targetVariance = 15;
          const newL = Math.max(0, Math.min(100, 
            targetHsl[2] + (normalizedL - 0.5) * targetVariance
          ));
          
          const [newR, newG, newB] = hslToRgb(targetHsl[0], targetHsl[1], newL);
          data[i] = newR;
          data[i + 1] = newG;
          data[i + 2] = newB;
          break;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    resolve(canvas.toDataURL());
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
