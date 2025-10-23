# Chodský Kroj - Interaktivní vzdělávací aplikace

## Přehled projektu

Interaktivní webová aplikace pro poznávání a sestavování barevných kombinací tradičních chodských krojů. Aplikace umožňuje uživatelům vybírat jednotlivé části kroje (sukně, fjertuch, šátek, pantle) z fotografií skutečných součástí, automaticky detekuje převládající barvu a aplikuje ji na kresbový obrázek kroje. Následně vyhodnotí, zda vybraná kombinace odpovídá tradičním pravidlům.

## Funkce aplikace

### Hlavní funkce
- **Interaktivní kresbový obrázek kroje** - Uživatel může kliknout na různé části kroje (sukně, fjertuch, šátek, pantle)
- **Galerie fotografií** - Pro každou část kroje je k dispozici galerie s různými barevnými variantami
- **Automatická detekce barev** - Po výběru fotografie aplikace automaticky detekuje převládající barvu pomocí Canvas API
- **Vizuální aplikace barev** - Detekovaná barva se aplikuje jako barevný overlay na kresbový obrázek kroje
- **Validace kombinací** - Tlačítko "Vyhodnotit kombinaci" zkontroluje, zda vybraná kombinace barev odpovídá tradičním pravidlům
- **Vtipné zpětnovazební hlášky** - Aplikace zobrazuje různé české hlášky podle toho, zda je kombinace správná či ne

### Technická implementace
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui komponenty
- **Detekce barev**: Canvas API s bucketing algoritmem pro robustní detekci dominantní barvy
- **Nahrazování barev**: HSL color range matching - nahrazuje konkrétní barvy v definovaných oblastech obrázku
- **Konfigurace**: JSON soubor s pravidly pro barevné kombinace a zpětnovazebními hláškami
- **Design**: Kulturně autentický design s teplou paletou inspirovanou chodským folklorem

## Struktura projektu

### Klíčové soubory

#### Frontend komponenty
- `client/src/components/KrojViewer.tsx` - Hlavní komponenta zobrazující kresbový obrázek kroje s interaktivními oblastmi
- `client/src/components/PartGallery.tsx` - Galerie fotografií pro jednotlivé části kroje
- `client/src/components/ValidationDialog.tsx` - Dialog zobrazující výsledek validace
- `client/src/pages/Home.tsx` - Hlavní stránka aplikace
- `client/src/lib/colorExtractor.ts` - Utility pro detekci převládající barvy z obrázků

#### Statické soubory
- `public/kroje/` - Adresář s fotografiemi jednotlivých částí kroje (staženo z původního prototypu)
- `public/kroj-config.json` - Konfigurační soubor s pravidly validace a hláškami
- `public/kroj-sablona.jpg` - Realistický obrázek kroje používaný jako šablona pro nahrazování barev

#### Konfigurace
- `design_guidelines.md` - Designové směrnice s barevnou paletou a typografií
- `tailwind.config.ts` - Tailwind konfigurace
- `client/src/index.css` - CSS s proměnnými pro barevné schéma

## Konfigurace pravidel

Soubor `public/kroj-config.json` obsahuje:

### Povolené kombinace barev
```json
{
  "validationRules": {
    "allowedCombinations": [
      {
        "sukne": "red",
        "fjertuch": "colorful", 
        "satek": "white",
        "pantle": "red",
        "name": "Tradiční slavnostní"
      },
      // další kombinace...
    ]
  }
}
```

### Zpětnovazební hlášky
```json
{
  "messages": {
    "success": ["Výborně! Tato kombinace je tradičně správná! 🎉", ...],
    "error": ["Och! Tato kombinace není úplně tradičně správná. Zkuste to znovu! 🤔", ...],
    "incomplete": "Nejdříve vyberte všechny části kroje..."
  }
}
```

## Rozpoznávané barvy

Aplikace rozpoznává tyto barvy z fotografií:
- `red` - červená
- `white` - bílá
- `blue` - modrá
- `green` - zelená
- `yellow` - žlutá
- `pink` - růžová
- `purple` - fialová
- `brown` - hnědá
- `colorful` - barevná (multi-color)
- `gray` - šedá

## Dostupné součásti kroje

### Sukně (3 varianty)
- Bílá, Červená, Žlutá

### Fjertuch - Zástěra (13 variant)
- Barevný, Barevný 2, Červený, Fialový, Fialový 2, Hnědý, Modrý, Růžový, Růžový 2, Růžový 3, Zelený, Zelený 2, Zelený 3

### Šátek (6 variant)
- Bílý, Červený, Modrý, Modrý 2, Růžový, Zelený

### Pantle - Stuhy (4 varianty)
- Bílé, Červené, Modré, Zelené

## Jak upravit pravidla

1. Otevřete soubor `public/kroj-config.json`
2. Přidejte novou kombinaci do pole `allowedCombinations`:
```json
{
  "sukne": "název_barvy",
  "fjertuch": "název_barvy",
  "satek": "název_barvy",
  "pantle": "název_barvy",
  "name": "Název kombinace",
  "description": "Popis kombinace"
}
```
3. Případně upravte zpětnovazební hlášky v poli `messages.success` nebo `messages.error`
4. Změny se projeví okamžitě bez nutnosti restartovat aplikaci

## Spuštění aplikace

Aplikace je již nakonfigurována a běží pomocí workflow "Start application":

```bash
npm run dev
```

Server běží na portu 5000 a je dostupný na `http://0.0.0.0:5000`

## Technologický stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui komponenty
- **Build Tool**: Vite
- **Backend**: Express.js (pro servírování statických souborů)
- **State Management**: React useState hooks
- **Notifikace**: shadcn/ui Toast komponenta
- **Dialogy**: shadcn/ui Dialog komponenta

## Design systém

### Barevná paleta
- **Primary**: `hsl(358, 75%, 45%)` - Tmavě červená (tradiční výšivky)
- **Secondary**: `hsl(210, 60%, 35%)` - Bohatá modrá (vzory krojů)
- **Accent**: `hsl(35, 65%, 50%)` - Teplá jantarová/zlatá
- **Background**: `hsl(48, 8%, 97%)` - Teplá off-white (připomíná lněné plátno)

### Typografie
- **Nadpisy**: Playfair Display (serif - elegantní, připomíná tradiční řemeslo)
- **Tělo textu**: Inter (sans-serif - čitelný, moderní)
- **Vtipné hlášky**: Caveat (rukopisný styl)

## Budoucí vylepšení

Možná rozšíření aplikace:
- Export sestavené kombinace jako obrázek
- Uložení oblíbených kombinací
- Galerie historicky správných kombinací
- Informační popisy k jednotlivým částem kroje
- Více částí kroje (kanduš, šerka)
- Režim kvízu/testu znalostí

## Poznámky k vývoji

### Nahrazování barev
Aplikace používá pokročilý systém nahrazování barev založený na HSL color range matching:

1. **Definice oblastí** (`colorReplacer.ts`):
   - Každá část kroje má definovaný HSL rozsah původní barvy
   - Šátek (bílá/krémová): H:0-60°, S:0-20%, L:80-100%
   - Fjertuch (zelená): H:80-160°, S:30-100%, L:30-70%
   - Sukně (červená): H:340-20°, S:40-100%, L:25-60%
   - Pantle (žlutá): H:40-65°, S:60-100%, L:45-75%

2. **Proces nahrazování**:
   - Načte se šablona obrázku kroje (`/kroj-sablona.jpg`)
   - Při výběru varianty se detekuje její dominantní barva
   - Algoritmus projde každý pixel obrázku
   - Pixely odpovídající HSL rozsahu dané části se nahradí novou barvou
   - Zachovává se světlost (L) pixelu pro realističtější efekt
   - Vrací se data URL zpracovaného obrázku

3. **Optimalizace**:
   - Canvas API s `willReadFrequently` příznakem
   - Bucketing algoritmus pro rychlejší detekci dominantní barvy
   - Vyloučení příliš světlých a tmavých pixelů

### Další poznámky
- Fotografie součástí jsou staženy z původního prototypu na https://edudant.github.io/chodsky-kroj/
- Šablona kroje je realistická fotografie pro autentičtější vizualizaci
- Aplikace je optimalizována pro rychlé načítání pomocí zmenšených náhledů v galeriích
