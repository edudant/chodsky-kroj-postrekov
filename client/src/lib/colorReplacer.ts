export interface ColorRange {
  hMin: number;
  hMax: number;
  sMin: number;
  sMax: number;
  lMin: number;
  lMax: number;
}

export interface PolygonRegion {
  points: Array<{ x: number; y: number }>;
}

export interface KrojPart {
  name: string;
  originalColorRange: ColorRange;
  region: PolygonRegion;
}

export const krojParts: Record<string, KrojPart> = {
  satek: {
    name: 'Šátek',
    originalColorRange: {
      hMin: 0,
      hMax: 360,
      sMin: 0,
      sMax: 100,
      lMin: 0,
      lMax: 100,
    },
    region: {
      points: [
        { x: 0.35, y: 0.15 },
        { x: 0.65, y: 0.15 },
        { x: 0.60, y: 0.35 },
        { x: 0.40, y: 0.35 },
      ],
    },
  },
  fjertuch: {
    name: 'Fjertuch',
    originalColorRange: {
      hMin: 0,
      hMax: 360,
      sMin: 0,
      sMax: 100,
      lMin: 0,
      lMax: 100,
    },
    region: {
      points: [
        { x: 0.30, y: 0.50 },
        { x: 0.75, y: 0.50 },
        { x: 0.75, y: 0.90 },
        { x: 0.30, y: 0.90 },
      ],
    },
  },
  sukne: {
    name: 'Sukně',
    originalColorRange: {
      hMin: 0,
      hMax: 360,
      sMin: 0,
      sMax: 100,
      lMin: 0,
      lMax: 100,
    },
    region: {
      points: [
        { x: 0.05, y: 0.61 },
        { x: 0.25, y: 0.61 },
        { x: 0.25, y: 0.89 },
        { x: 0.05, y: 0.89 },
      ],
    },
  },
  pantle: {
    name: 'Pantle',
    originalColorRange: {
      hMin: 0,
      hMax: 360,
      sMin: 0,
      sMax: 100,
      lMin: 0,
      lMax: 100,
    },
    region: {
      points: [
        { x: 0.62, y: 0.39 },
        { x: 0.70, y: 0.39 },
        { x: 0.70, y: 0.47 },
        { x: 0.62, y: 0.47 },
      ],
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

function isPointInPolygon(x: number, y: number, polygon: Array<{ x: number; y: number }>): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
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

    const replacements: Array<{ 
      region: PolygonRegion; 
      targetHsl: [number, number, number];
      range: ColorRange;
    }> = [];
    
    for (const [partKey, hexColor] of Object.entries(colorReplacements)) {
      const part = krojParts[partKey];
      if (part && hexColor) {
        const rgb = hexToRgb(hexColor);
        if (rgb) {
          const targetHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          replacements.push({ 
            region: part.region, 
            targetHsl,
            range: part.originalColorRange
          });
        }
      }
    }

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        if (a === 0) continue;
        
        const normalizedX = x / canvas.width;
        const normalizedY = y / canvas.height;
        
        const [h, s, l] = rgbToHsl(r, g, b);
        
        for (const { region, targetHsl, range } of replacements) {
          if (isPointInPolygon(normalizedX, normalizedY, region.points)) {
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
