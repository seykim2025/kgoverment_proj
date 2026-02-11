# Learnings - Premium Aesthetic Upgrade

## Conventions & Patterns

*This file tracks conventions, patterns, and best practices discovered during implementation.*

---

"## [2026-02-10] Wave 1: Navigation Z-Index + Hero Layout Fixes"  
  
"### Z-Index Hierarchy Pattern"  
"- Navigation: z-60 (highest - always on top)"  
"- Mobile Menu: z-55 (middle - slides over backdrop)"  
"- Backdrop: z-50 (lowest - overlays content)"  
"- Proper hierarchy prevents layering conflicts"  
  
"### Hero Section Responsive Pattern"  
"- Use `pt-24` to account for fixed nav (h-16 = 64px)"  
"- Responsive gap: `gap-8 lg:gap-12` (smaller on mobile)"  
"- H1 text: Use `<span className=\"block\">` instead of `<br />` for better control"  
"- Floating cards: Use `shadow-xl` for premium aesthetic"  
 
"## [2026-02-10] Wave 2: HSL Color System + Micro-Interactions"  
  
"### HSL Color System Benefits"  
"- HSL format: `hue saturation%% lightness%%` (no hsl() wrapper needed in CSS vars)"  
"- Better manipulation: Can adjust lightness/saturation independently"  
"- Transparency: Works seamlessly with alpha channel"  
"- Converted all color variables: primary, secondary, accent, semantic, bg, text, border"  
  
"### Micro-Interaction Utilities"  
"- Hover scales: .hover-scale-102, .hover-scale-105, .hover-scale-110"  
"- Pulse effects: .pulse-slow, .pulse-glow (using transform for performance)"  
"- Smooth transitions: .transition-smooth, .transition-smooth-fast, .transition-smooth-slow"  
"- Premium effects: .hover-lift, .hover-glow, .focus-ring"  
"- Performance: All use CSS transforms (not position) for 60fps animations"  
 
"## [2026-02-10] Wave 3: Premium Glassmorphism Implementation"  
  
"### Glassmorphism Best Practices"  
"- Navigation: `bg-white/80 backdrop-blur-xl` when scrolled for premium feel"  
"- Hero cards: `bg-white/90 backdrop-blur-xl` for main card, `bg-white/95 backdrop-blur-lg` for floating cards"  
"- Border enhancement: `border-white/20` to `border-white/30` for subtle glass edge"  
"- Browser compatibility: Include `-webkit-backdrop-filter` for Safari support"  
"- Fallback strategy: Use `@supports not (backdrop-filter)` for older browsers"  
  
"### Glassmorphism Utility Classes"  
"- .glass-light: 80%% opacity, 12px blur"  
"- .glass-medium: 70%% opacity, 16px blur"  
"- .glass-strong: 90%% opacity, 20px blur"  
"- .glass-dark: Dark variant for light backgrounds"  
 
