---
name: Liquid Glass
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ccc3d3'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#968e9c'
  outline-variant: '#4a4451'
  surface-tint: '#d7baff'
  primary: '#d7baff'
  on-primary: '#411478'
  primary-container: '#bd93f9'
  on-primary-container: '#4e2484'
  inverse-primary: '#714aaa'
  secondary: '#fff9ef'
  on-secondary: '#3a3000'
  secondary-container: '#ffdb3c'
  on-secondary-container: '#725f00'
  tertiary: '#cccc47'
  on-tertiary: '#323200'
  tertiary-container: '#acac28'
  on-tertiary-container: '#3e3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d7baff'
  on-primary-fixed: '#290055'
  on-primary-fixed-variant: '#593090'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#e9e960'
  tertiary-fixed-dim: '#cccc47'
  on-tertiary-fixed: '#1d1d00'
  on-tertiary-fixed-variant: '#494900'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  glass-border: rgba(255, 255, 255, 0.12)
  glass-fill: rgba(255, 255, 255, 0.03)
  void-black: '#050505'
  glow-purple: rgba(189, 147, 249, 0.4)
  glow-gold: rgba(255, 215, 0, 0.3)
typography:
  headline-xl:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 80px
  glass-padding: 32px
---

## Brand & Style

The design system is a high-end, immersive aesthetic that blends spiritual depth with cutting-edge interface design. It is designed to evoke a sense of "digital sanctuary"—a space that feels premium, ethereal, and intellectually profound. 

The visual direction is **Glassmorphism**, characterized by translucent surfaces that behave like liquid crystal. It leverages deep obsidian voids contrasted against vibrant, glowing accents to create a sense of infinite depth. The tone is authoritative yet illuminating, making it ideal for advanced educational platforms or spiritual guidance apps that want to feel modern and "enlightened."

**Key visual drivers:**
- **Atmospheric Depth:** The UI is not a flat plane but a series of floating glass layers.
- **Luminosity:** Elements should appear to be lit from within or by a soft external glow.
- **Tactile Ethereality:** Surfaces feel smooth and polished, like liquid glass, using subtle blurs to separate content from the background.

## Colors

This design system is built on a **Deep Dark** foundation. The core surface is a "Void Black" (#050505) which provides the necessary contrast for glass effects and glows.

- **Primary (Vibrant Purple):** Derived from the heritage logo, this color acts as the "light source" for the UI. It is used for primary actions and active states.
- **Secondary (Gold):** Used for premium features, scholarly achievements, and high-level navigation markers. 
- **Glass Surfaces:** Instead of solid grays, we use a custom `glass-fill` (3% white) paired with a `glass-border` (12% white) to create the illusion of transparency.
- **Accent Glows:** Soft radial gradients in `glow-purple` should be placed behind key content blocks to simulate depth and spiritual "energy."

## Typography

The typography creates a tension between the "Sacred" and the "Scientific."

**Libre Caslon Text** is the voice of authority and tradition. It is used exclusively for headlines. In the `headline-xl` role, it should be treated as a display face, often utilizing very tight tracking to feel more editorial and prestigious.

**Inter** provides the functional, modern balance. Its neutral, utilitarian structure ensures that complex educational or spiritual text remains highly legible against dark, blurred backgrounds. 

Labels and navigation elements should always use **Inter** in uppercase with expanded letter spacing to maintain a clean, "systematic" feel that doesn't compete with the expressive serif headers.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid with Focal Centering**. While the content spans a standard 12-column system, the background is treated as a vast, non-linear space.

- **Desktop:** 12-column grid with a 1200px max-width. Sections are separated by generous gaps (80px) to allow the background blurs and glows room to breathe.
- **Mobile:** 4-column grid. The focus shifts to a single-column stack, but margins are kept tighter (20px) to maximize the "glass" real estate.
- **Glass Containers:** Use a standard `glass-padding` (32px) for cards and modals to ensure content is well-inset from the glowing edges of the glass borders.

## Elevation & Depth

Depth is achieved through **Backdrop Refraction** rather than traditional shadows.

- **Background:** Pure `#050505` with large, low-opacity radial gradients of Primary Purple and Secondary Gold (15-20% opacity) floating in the distance.
- **Surface Level:** Translucent containers using `backdrop-filter: blur(20px)`. This creates a frosted effect where the background colors bleed through softly.
- **Borders:** Every glass container must have a 1px border. Use a linear gradient for the border (Top-Left: 20% white to Bottom-Right: 5% white) to simulate a light source hitting the "edge" of the glass.
- **Active State:** Elements in focus should increase their `backdrop-filter` blur to 40px and add a soft outer glow (`box-shadow: 0 0 20px rgba(189, 143, 249, 0.2)`).

## Shapes

The design system uses **Rounded (2)** geometry. 

Corners are set to 0.5rem (8px) for standard components, which provides a sophisticated, hardware-like feel reminiscent of modern smartphone displays. This "liquid" roundness avoids the playfulness of pill shapes while moving away from the coldness of sharp corners. 

For high-level containers (Modals or large Glass Cards), use `rounded-xl` (1.5rem/24px) to emphasize the "object-like" quality of the UI floating in space.

## Components

### Glass Buttons
Buttons should not be solid blocks of color. 
- **Primary:** A semi-transparent purple fill (40% opacity) with a `backdrop-filter: blur(10px)` and a bright 1px top border.
- **Secondary:** No fill, only a 1px Gold border with a subtle Gold outer glow on hover.

### Liquid Cards
Cards are the primary content vessel. They use the `glass-fill` and `glass-border` tokens. The top-left corner of the card should have a subtle "highlight" (a white-to-transparent gradient at 10% opacity) to give the glass a 3D thickness.

### Form Inputs
Inputs should appear as "cutouts" in the glass. Use a slightly darker background than the card they sit on with a sharp, 1px inner border. The cursor and focus ring should use the Primary Purple glow.

### Chips & Badges
Small, high-blur glass elements. For status indicators (e.g., "Live Session"), use a small pulsing dot in Gold or Purple next to the label.

### Lists & Navigation
Navigation items should be separated by thin, low-opacity horizontal glass lines. Hovering over a list item should trigger a soft "backlight" glow behind the text rather than a background color change.