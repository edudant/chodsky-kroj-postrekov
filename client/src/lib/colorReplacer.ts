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
      // Target whites→cream→beige→tan, avoid reds and greens
      // Push to deeper tan: widen saturation a bit and allow lower lightness
      // H ~20–58 (warm band), S 0–70, L 38–95
      hMin: 20,
      hMax: 100,
      sMin: 0,
      sMax: 100,
      lMin: 38,
      lMax: 95,
    },
    region: [[509, 268], [536, 259], [604, 311], [658, 364], [646, 297], [666, 289], [708, 297], [785, 387], [793, 421], [790, 457], [780, 492], [745, 525], [726, 540], [708, 572], [631, 537], [571, 477], [494, 387], [522, 376], [536, 342], [529, 300], [522, 285]],
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
      hMin: 0,
      hMax: 360,
      sMin: 0,
      sMax: 100,
      lMin: 0,
      lMax: 100,
    },
    region: [[351, 988], [354, 950], [354, 868], [356, 772], [371, 638], [394, 600], [359, 593], [327, 630], [264, 976]],
  },
  pantle: {
    name: 'Pantle',
    originalColorRange: {
      hMin: 340,
      hMax: 20,
      sMin: 40,
      sMax: 100,
      lMin: 25,
      lMax: 75,
    },
    region: [[441, 514], [431, 536], [456, 545], [478, 535], [521, 529], [523, 520]],
  },
};

// Pomocné funkce pro práci s názvy souborů a výběr polygonu pro pantle
function getFilenameKeyFromUrl(url: string): string {
  try {
    // Odstraň případný query string a fragment
    const clean = url.split('?')[0].split('#')[0];
    const parts = clean.split('/');
    const filename = parts[parts.length - 1] || '';
    // Bez přípony
    return filename.replace(/\.[^.]+$/, '');
  } catch {
    return url;
  }
}

function getPantleTextureRegionFromSrc(src: string): Region | undefined {
  const key = getFilenameKeyFromUrl(src);
  // Zkus přímý klíč
  if (pantleTextureRegions[key]) return pantleTextureRegions[key];
  // Heuristika: najdi klíč, který je podřetězcem názvu souboru
  const matchKey = Object.keys(pantleTextureRegions).find(k => key.includes(k));
  if (matchKey) return pantleTextureRegions[matchKey];
  return undefined;
}

// Polygony pro výřez textury z obrázků pantlí
export const pantleTextureRegions: Record<string, Region> = {
  'pantle_cervena': [[245, 633], [508, 660], [475, 901], [185, 879]],
  'pantle_modra': [[306, 909], [559, 921], [538, 1131], [283, 1124]],
  'pantle_zelena': [[278, 742], [527, 761], [499, 999], [237, 972]],
  'pantle_bila': [[296, 702], [537, 720], [509, 965], [259, 947]],
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
          // Pokud je vybrána bílá pro šátek, přeskoč náhradu (ponech originál)
          if (partKey === 'satek' && rgb.r >= 250 && rgb.g >= 250 && rgb.b >= 250) {
            continue;
          }
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

// Nová funkce pro nahrazení textury v oblasti
export function replaceWithTexture(
  sourceImage: HTMLImageElement,
  textureImages: Record<string, HTMLImageElement>
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
    
    // Nakresli základní obrázek
    ctx.drawImage(sourceImage, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Měřítko mezi viewBox (1000x1400) a skutečnou velikostí obrázku
    const scaleX = canvas.width / 1000;
    const scaleY = canvas.height / 1400;

    // Projdi každou část s texturou
    for (const [partKey, textureImg] of Object.entries(textureImages)) {
      const part = krojParts[partKey];
      if (!part || !part.region || part.region.length === 0) continue;

      const region = part.region;
      const colorRange = part.originalColorRange;
      
      // Vytvoř dočasný canvas pro texturu
      const texCanvas = document.createElement('canvas');
      const texCtx = texCanvas.getContext('2d');
      if (!texCtx) continue;
      
      // Najdi bounding box polygonu pro optimalizaci
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [px, py] of region) {
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
      }
      
      const regionWidth = maxX - minX;
      const regionHeight = maxY - minY;
      
  // Pro sukni: škáluj texturu na celou výšku regionu
  // Pro pantle: vyřízni polygon z textury a otoč o 80°
      // Pro ostatní části: použij tile pattern s max velikostí 200px
      if (partKey === 'sukne') {
        // Škáluj POUZE výšku na celou výšku regionu, šířku nech původní
        const regionPixelHeight = Math.ceil(regionHeight * scaleY);
        
        texCanvas.width = textureImg.width;  // Původní šířka
        texCanvas.height = regionPixelHeight; // Škálovaná výška
        // Roztáhni texturu pouze vertikálně
        texCtx.drawImage(textureImg, 0, 0, textureImg.width, textureImg.height, 0, 0, texCanvas.width, texCanvas.height);
      } else if (partKey === 'pantle') {
        // Pro pantle: vyřízni polygon z textury dle názvu souboru a otoč o ~80° doprava
        const textureRegion = getPantleTextureRegionFromSrc(textureImg.src);
        
        if (textureRegion && textureRegion.length > 0) {
          // Najdi bounding box polygonu v textuře
          let texMinX = Infinity, texMinY = Infinity, texMaxX = -Infinity, texMaxY = -Infinity;
          for (const [px, py] of textureRegion) {
            texMinX = Math.min(texMinX, px);
            texMinY = Math.min(texMinY, py);
            texMaxX = Math.max(texMaxX, px);
            texMaxY = Math.max(texMaxY, py);
          }
          
          const texWidth = texMaxX - texMinX;
          const texHeight = texMaxY - texMinY;
          
          // Vytvoř dočasný canvas pro výřez
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) continue;
          
          tempCanvas.width = texWidth;
          tempCanvas.height = texHeight;
          
          // Vyřízni polygon z textury
          tempCtx.drawImage(textureImg, texMinX, texMinY, texWidth, texHeight, 0, 0, texWidth, texHeight);
          
          // Vytvoř finální canvas s rotací 80° doprava
          const angle = 80 * Math.PI / 180;
          const cos = Math.abs(Math.cos(angle));
          const sin = Math.abs(Math.sin(angle));
          const rotatedWidth = Math.ceil(texHeight * sin + texWidth * cos);
          const rotatedHeight = Math.ceil(texHeight * cos + texWidth * sin);
          
          // Nejprve vytvoř dočasné plátno pro otočený obraz
          const rotatedCanvas = document.createElement('canvas');
          const rotatedCtx = rotatedCanvas.getContext('2d');
          if (!rotatedCtx) continue;
          rotatedCanvas.width = rotatedWidth;
          rotatedCanvas.height = rotatedHeight;
          rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
          rotatedCtx.rotate(angle);
          rotatedCtx.drawImage(tempCanvas, -texWidth / 2, -texHeight / 2);
          rotatedCtx.setTransform(1, 0, 0, 1, 0, 0);

          // Následně škáluj výšku otočené textury na výšku regionu pantle,
          // šířku uprav proporcionálně (bez opakování vertikálně)
          const regionPixelHeight = Math.ceil(regionHeight * scaleY);
          const scale = regionPixelHeight / rotatedCanvas.height;
          const scaledWidth = Math.max(1, Math.floor(rotatedCanvas.width * scale));
          texCanvas.width = scaledWidth;
          texCanvas.height = regionPixelHeight;
          texCtx.drawImage(rotatedCanvas, 0, 0, rotatedCanvas.width, rotatedCanvas.height, 0, 0, texCanvas.width, texCanvas.height);
        } else {
          // Fallback: použij celou texturu otočenou o 80°
          const angle = 80 * Math.PI / 180;
          const cos = Math.abs(Math.cos(angle));
          const sin = Math.abs(Math.sin(angle));
          const rotatedWidth = Math.ceil(textureImg.height * sin + textureImg.width * cos);
          const rotatedHeight = Math.ceil(textureImg.height * cos + textureImg.width * sin);
          
          // Otoč na dočasné plátno
          const rotatedCanvas = document.createElement('canvas');
          const rotatedCtx = rotatedCanvas.getContext('2d');
          if (!rotatedCtx) continue;
          rotatedCanvas.width = rotatedWidth;
          rotatedCanvas.height = rotatedHeight;
          rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
          rotatedCtx.rotate(angle);
          rotatedCtx.drawImage(textureImg, -textureImg.width / 2, -textureImg.height / 2);
          rotatedCtx.setTransform(1, 0, 0, 1, 0, 0);

          // Přizpůsob výšku regionu pantle
          const regionPixelHeight = Math.ceil(regionHeight * scaleY);
          const scale = regionPixelHeight / rotatedCanvas.height;
          const scaledWidth = Math.max(1, Math.floor(rotatedCanvas.width * scale));
          texCanvas.width = scaledWidth;
          texCanvas.height = regionPixelHeight;
          texCtx.drawImage(rotatedCanvas, 0, 0, rotatedCanvas.width, rotatedCanvas.height, 0, 0, texCanvas.width, texCanvas.height);
        }
      } else {
        // Pro ostatní části: škáluj texturu na rozumnou velikost
        const maxTexSize = 200;
        const texScale = Math.min(1, maxTexSize / Math.max(textureImg.width, textureImg.height));
        
        texCanvas.width = Math.floor(textureImg.width * texScale);
        texCanvas.height = Math.floor(textureImg.height * texScale);
        texCtx.drawImage(textureImg, 0, 0, texCanvas.width, texCanvas.height);
      }
      
      const texImageData = texCtx.getImageData(0, 0, texCanvas.width, texCanvas.height);
      const texData = texImageData.data;
      
      const minPixelX = Math.floor(minX * scaleX);
      const minPixelY = Math.floor(minY * scaleY);
      const maxPixelX = Math.ceil(maxX * scaleX);
      const maxPixelY = Math.ceil(maxY * scaleY);

      // Projdi pouze pixely v bounding boxu
      for (let y = minPixelY; y <= maxPixelY && y < canvas.height; y++) {
        for (let x = minPixelX; x <= maxPixelX && x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          
          // Zkontroluj, zda je pixel v polygonu
          const viewBoxX = x / scaleX;
          const viewBoxY = y / scaleY;
          
          if (!isPointInPolygon(viewBoxX, viewBoxY, region)) continue;
          
          // Pro sukni: přeskoč POUZE čistě bílé pozadí (s malou tolerancí)
          // Pro pantle: nahraď vše uvnitř polygonu (bez barevného filtru)
          // Pro ostatní části: kontroluj barevný rozsah
          if (partKey === 'sukne') {
            // Vynech bílé pozadí (s tolerancí 5 pro kompresi JPEG)
            if (r >= 250 && g >= 250 && b >= 250) continue;
            // Ignoruj průhledné pixely
            if (a === 0) continue;
          } else if (partKey === 'pantle') {
            // Pro pantle přepiš všechny pixely v polygonu (kromě plně průhledných)
            if (a === 0) continue;
          } else {
            // Ignoruj průhledné pixely
            if (a === 0) continue;
            
            // Zkontroluj, zda pixel odpovídá původní barvě části kroje
            const [h, s, l] = rgbToHsl(r, g, b);
            
            if (!isInColorRange(h, s, l, colorRange)) continue;
          }
          
          // Pro sukni: mapuj podle relativní pozice v regionu
          // Pro ostatní: použij tile pattern
          let texX, texY;
          
          if (partKey === 'sukne') {
            // Relativní pozice v regionu (0-1)
            const relY = (viewBoxY - minY) / regionHeight;
            const relX = (viewBoxX - minX) / regionWidth;
            
            // Pro šířku: opakuj texturu (tile)
            texX = Math.floor(relX * texCanvas.width) % texCanvas.width;
            // Pro výšku: přímé mapování (bez opakování)
            texY = Math.floor(relY * texCanvas.height);
            
            // Ošetři přetečení na výšce
            if (texY >= texCanvas.height) texY = texCanvas.height - 1;
            if (texY < 0) texY = 0;
            // Ošetři přetečení na šířce (wrap)
            if (texX >= texCanvas.width) texX = texX % texCanvas.width;
            if (texX < 0) texX = 0;
          } else if (partKey === 'pantle') {
            // Mapování relativně k oblasti pantle
            const relY = (viewBoxY - minY) / regionHeight;
            const relX = (viewBoxX - minX) / regionWidth;
            // Vertikálně: přímé mapování (bez opakování)
            texY = Math.floor(relY * texCanvas.height);
            // Horizontálně: wrap (opakování), aby se vyplnila šířka
            texX = Math.floor(relX * texCanvas.width) % texCanvas.width;
            if (texY >= texCanvas.height) texY = texCanvas.height - 1;
            if (texY < 0) texY = 0;
            if (texX < 0) texX = 0;
          } else {
            // Tile pattern
            texX = x % texCanvas.width;
            texY = y % texCanvas.height;
          }
          
          const texIndex = (texY * texCanvas.width + texX) * 4;
          
          // Vezmi barvu z textury
          const texR = texData[texIndex];
          const texG = texData[texIndex + 1];
          const texB = texData[texIndex + 2];
          const texA = texData[texIndex + 3];
          
          // Kompletně nahraď pixel texturou
          data[index] = texR;
          data[index + 1] = texG;
          data[index + 2] = texB;
          data[index + 3] = texA;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    resolve(canvas.toDataURL());
  });
}

