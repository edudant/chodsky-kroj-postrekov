export interface ColorRange {
  hMin: number;
  hMax: number;
  sMin: number;
  sMax: number;
  lMin: number;
  lMax: number;
}

export type Point = [number, number];

export type Region = Point[];

export interface KrojPart {
  name: string;
  originalColorRange: ColorRange;
  region?: Region;
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
    region: [[506, 269], [528, 288], [533, 303], [538, 329], [538, 354], [526, 370], [501, 385], [568, 461], [613, 514], [657, 544], [705, 569], [725, 543], [749, 522], [769, 496], [787, 456], [797, 432], [784, 388], [769, 394], [777, 421], [757, 440], [730, 463], [722, 477], [715, 508], [697, 517], [682, 478], [667, 437], [633, 428], [598, 409], [573, 355], [555, 328], [533, 290]],
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
    region: [[389, 599], [364, 629], [349, 754], [349, 796], [351, 863], [339, 1031], [416, 1051], [531, 1045], [555, 1040], [722, 1041], [727, 1027], [869, 1023], [901, 1012], [861, 772], [822, 661], [822, 627], [799, 583], [650, 575], [598, 541], [570, 594], [553, 599], [508, 587], [429, 603]],
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
    region: [[351, 988], [354, 950], [354, 868], [356, 772], [371, 638], [394, 600], [359, 593], [327, 630], [264, 976]],
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
    region: [[441, 514], [431, 536], [456, 545], [478, 535], [521, 529], [523, 520]],
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

// Ray casting algorithm pro detekci bodu v polygonu
function isPointInPolygon(x: number, y: number, polygon: Region): boolean {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) {
      inside = !inside;
    }
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

    // Připrava náhrad s regiony
    const replacements: Array<{ 
      range: ColorRange; 
      targetHsl: [number, number, number];
      region?: Region;
    }> = [];
    
    for (const [partKey, hexColor] of Object.entries(colorReplacements)) {
      const part = krojParts[partKey];
      if (part && hexColor) {
        const rgb = hexToRgb(hexColor);
        if (rgb) {
          const targetHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          replacements.push({ 
            range: part.originalColorRange, 
            targetHsl,
            region: part.region
          });
        }
      }
    }

    // Vypočítám měřítko mezi viewBox (1000x1400) a skutečnou velikostí obrázku
    const scaleX = canvas.width / 1000;
    const scaleY = canvas.height / 1400;

    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % canvas.width;
      const y = Math.floor(pixelIndex / canvas.width);
      
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      if (a === 0) continue;
      
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Převod pixel souřadnic na viewBox souřadnice
      const viewBoxX = x / scaleX;
      const viewBoxY = y / scaleY;
      
      for (const { range, targetHsl, region } of replacements) {
        // Kontrola, zda pixel leží v polygonu (pokud je region definován)
        if (region && region.length > 0) {
          if (!isPointInPolygon(viewBoxX, viewBoxY, region)) {
            continue; // Pixel není v polygonu, zkusím další replacement
          }
        }
        
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
