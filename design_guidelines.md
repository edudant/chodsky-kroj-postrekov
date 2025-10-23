# Design Guidelines: Chodský Kroj Interactive Application

## Design Approach

**Selected Approach**: Custom cultural design with modern usability principles
**Justification**: This educational tool celebrating Czech folk heritage requires a unique aesthetic that respects Chodsko cultural traditions while maintaining modern web usability. The design should feel warm, inviting, and educational - bridging traditional folk art with contemporary interaction patterns.

**Core Principles**:
- Cultural authenticity with clean, accessible interface
- Warm, welcoming educational experience
- Visual hierarchy that guides learning
- Respectful presentation of traditional costume elements

## Color Palette

**Light Mode (Primary)**:
- Background: 48 8% 97% (warm off-white, reminiscent of natural linen)
- Primary: 358 75% 45% (deep folk red from traditional embroidery)
- Secondary: 210 60% 35% (rich blue from costume patterns)
- Accent: 35 65% 50% (warm amber/gold from decorative elements)
- Text primary: 220 15% 20% (soft charcoal)
- Text secondary: 220 10% 45% (muted gray)
- Success: 145 60% 40% (forest green)
- Error: 0 70% 50% (vibrant red)

**Dark Mode** (if needed for accessibility):
- Background: 220 15% 15%
- Surfaces: 220 12% 22%
- Adjust other colors for proper contrast

## Typography

**Font Families** (via Google Fonts):
- Headings: 'Playfair Display' - elegant serif that nods to traditional craftsmanship
- Body: 'Inter' - clean, highly readable sans-serif for instructions and labels
- Accent: 'Caveat' - handwritten style for playful feedback messages

**Type Scale**:
- Hero/Main Title: text-4xl md:text-5xl, font-bold
- Section Headings: text-2xl md:text-3xl, font-semibold
- Part Labels: text-lg md:text-xl, font-medium
- Body Text: text-base, font-normal
- Small/Caption: text-sm, font-normal

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 or p-6
- Section spacing: mb-8 or mb-12
- Grid gaps: gap-4 or gap-6
- Container max-width: max-w-7xl

**Grid Structure**:
- Main costume image: Central focal point, approximately 60% of viewport width on desktop
- Part galleries: Grid layout, 2-4 columns depending on viewport
- Mobile: Single column stack, full-width elements

## Component Library

### Navigation/Header
- Simple top bar with logo/title "Sestavte si Chodský Kroj"
- Minimal navigation - this is a single-page application
- Optional info button for cultural context/instructions

### Main Costume Display
- Large, centered image of complete Chodský kroj
- Interactive SVG overlay with 4 clickable regions:
  - Sukně (Skirt): Lower portion
  - Fjertuch (Apron): Mid-section overlay
  - Šátek (Headscarf): Upper portion
  - Pantle (Ribbons): Mid-height accents
- Hover states: Subtle highlight with 0.3 opacity overlay in accent color
- Active selection: Border outline in primary color, 3px thickness
- Color application: CSS filters or overlay divs that tint the selected region

### Part Selection Galleries
- Four distinct gallery sections, one per costume part
- Section headers with part name and traditional Czech description
- Photo grid: 2-4 columns (responsive)
- Thumbnail cards:
  - Rounded corners: rounded-lg
  - Shadow on hover: hover:shadow-xl transition
  - Active state: Ring in primary color, ring-4
  - Padding: p-2
- Each card shows photograph with subtle border

### Validation/Results Section
- Prominent "Vyhodnotit" button:
  - Style: Large, primary color background
  - Position: Bottom center or fixed bottom on mobile
  - Size: px-12 py-4, text-lg
  - Folk pattern decorative element (border or icon)
- Results display:
  - Modal or slide-up panel
  - Large icon (checkmark for success, traditional folk motif)
  - Bold result text
  - Playful Czech phrase from configuration
  - Decorative folk art elements in background (subtle)

### Configuration Panel (Admin/Future)
- Simple JSON editor or form for:
  - Color combination rules
  - Validation messages (witty Czech phrases)
  - Cultural information snippets

## Visual Enhancements

**Decorative Elements**:
- Subtle folk pattern borders (repeating geometric motifs from Chodsko embroidery)
- Corner ornaments on main sections using traditional design elements
- Background texture: Very subtle linen or fabric texture (10-15% opacity)

**Interactive Feedback**:
- Smooth transitions: transition-all duration-300
- Micro-animations on selection: scale-105 on thumbnail selection
- Color preview: Small color swatch appears next to costume part name when selected

## Images

**Main Hero Image**: 
- Central costume image (existing kroj.jpeg)
- Should be high-quality, well-lit photograph showing complete Chodský kroj
- Position: Center of page, prominent but not overwhelming
- Treatment: Clean presentation with subtle drop shadow

**Thumbnail Images**:
- Use existing photographs from assets/kroje/ directory
- Each costume part has multiple color variants
- Display in grid galleries below main image
- Maintain aspect ratio, use object-cover for consistency

**Decorative Images**:
- Optional: Folk pattern borders/dividers between sections
- Optional: Small traditional motifs as section markers

## Accessibility

- Maintain WCAG AA contrast ratios
- Clear focus states on all interactive elements (ring-2 ring-offset-2)
- Alt text for all costume images describing color and part
- Keyboard navigation support for part selection
- Touch-friendly targets: minimum 44x44px tap areas

## Responsive Behavior

**Desktop (lg:)**:
- Side-by-side layout: Main costume image + gallery grid
- 3-4 column photo grids

**Tablet (md:)**:
- Stacked layout: Costume image above, galleries below
- 2-3 column photo grids

**Mobile (base)**:
- Full vertical stack
- Single column galleries
- Fixed bottom validation button
- Larger touch targets for costume part selection

This design celebrates Czech cultural heritage while providing an intuitive, modern learning experience for understanding traditional Chodský kroj color combinations.