# Layout Fix & Premium Aesthetic Upgrade

## TL;DR

> **Quick Summary**: Fix navigation z-index conflicts and hero section layout issues while upgrading to premium aesthetic inspired by Toss and Innovation Forest with glassmorphism, refined colors, and micro-interactions.
> 
> **Deliverables**: 
> - Fixed navigation z-index hierarchy
> - Enhanced hero section layout
> - Premium glassmorphism effects
> - HSL-based color system
> - Micro-interaction utilities
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Navigation fixes → Hero section layout → Global styles enhancement

---

## Context

### Original Request
Fix layout breakage (overlapping text, misaligned navigation) and upgrade to premium aesthetic inspired by Toss and Innovation Forest (혁신의숲).

### Interview Summary
**Key Discussions**:
- Navigation z-index conflicts identified (nav z-50, mobile menu z-50, backdrop z-40)
- Hero section potential text stacking issues in grid layout
- Need for premium glassmorphism effects
- Current hex colors need conversion to HSL for better manipulation
- Missing micro-interaction utilities

**Research Findings**:
- Navigation.tsx: z-index conflicts at lines 67-72 and 147, backdrop at 137
- page.tsx: Hero grid layout at lines 99-216, floating cards at 188-212
- globals.css: Hex color system (lines 19-55), existing shadow system (109-121), animations (241-287)

### Metis Review
**Identified Gaps** (addressed):
- Mobile navigation accessibility: Missing screen reader announcements for menu state changes
- Color contrast requirements: Need to verify WCAG AA compliance for new color scheme
- Performance considerations: Entrance animations should use transform instead of position changes
- Responsive testing: Ensure navigation works properly on ultra-wide screens (>1440px)

---

## Work Objectives

### Core Objective
Fix layout breakage issues and upgrade to premium aesthetic while maintaining accessibility and performance.

### Concrete Deliverables
- Fixed navigation z-index hierarchy
- Enhanced hero section with proper layout
- Premium glassmorphism effects
- HSL-based color system
- Micro-interaction utilities
- Entrance animations using CSS-only

### Definition of Done
- [ ] Navigation layers properly with correct z-index hierarchy
- [ ] Hero text never overlaps nav on any screen size
- [ ] Grid layout responsive on mobile/tablet/desktop
- [ ] Entrance animations smooth and performant
- [ ] Glassmorphism effect premium quality with proper blur
- [ ] Colors use HSL for better control
- [ ] Build passes without errors
- [ ] WCAG AA color contrast maintained

### Must Have
- Fix z-index conflicts (nav > backdrop > menu panel)
- Premium glassmorphism effects
- HSL color system
- CSS-only animations (no libraries)
- Responsive design

### Must NOT Have (Guardrails)
- NO animation libraries - CSS only
- NO breaking accessibility features
- NO color contrast below WCAG AA
- NO performance regression
- NO changes to navigation functionality (only visual/layout)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO test setup mentioned
- **User wants tests**: Manual verification (exhaustive QA procedures)
- **Framework**: None - manual browser testing

### Manual QA Only

**CRITICAL**: Without automated tests, manual verification MUST be exhaustive.

Each task includes detailed verification procedures:

**By Deliverable Type:**

| Type | Verification Tool | Procedure |
|------|------------------|-----------|
| **Navigation/Layout** | Browser dev tools | Inspect z-index, responsive testing |
| **CSS/Styles** | Browser inspector | Verify colors, animations, effects |
| **Responsive** | Browser resize/dev tools | Test all breakpoints |

**Evidence Required:**
- Screenshots of navigation layering
- Screenshots of responsive states
- Dev tools output showing z-index values
- Performance metrics (animation frame rates)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Fix Navigation Z-Index Hierarchy
└── Task 2: Enhance Hero Section Layout

Wave 2 (After Wave 1):
├── Task 3: Upgrade Global Styles to HSL
└── Task 4: Add Micro-Interaction Utilities

Wave 3 (After Wave 2):
└── Task 5: Premium Glassmorphism Implementation

Critical Path: Task 1 → Task 5 (navigation → final polish)
Parallel Speedup: ~40% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 5 | 2 |
| 2 | None | 5 | 1 |
| 3 | 1, 2 | 4, 5 | None |
| 4 | 3 | 5 | None |
| 5 | 1, 2, 3, 4 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="visual-engineering", load_skills=['frontend-ui-ux'], run_in_background=true) |
| 2 | 3, 4 | delegate_task(category="visual-engineering", load_skills=['frontend-ui-ux'], run_in_background=true) |
| 3 | 5 | delegate_task(category="visual-engineering", load_skills=['frontend-ui-ux'], run_in_background=true) |

---

## TODOs

- [ ] 1. Fix Navigation Z-Index Hierarchy

  **What to do**:
  - Update Navigation.tsx z-index values: nav (z-60), backdrop (z-50), mobile menu (z-55)
  - Ensure proper layering hierarchy
  - Test mobile menu backdrop interaction
  - Verify navigation accessibility with screen readers

  **Must NOT do**:
  - Change navigation functionality or behavior
  - Remove existing accessibility features
  - Add JavaScript libraries

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering` - Focuses on UI/UX design and visual implementation
    - Reason: Navigation is a core UI component requiring precise visual layering
  - **Skills**: [`frontend-ui-ux`] - Expertise in premium UI design and layout systems
    - `frontend-ui-ux`: Critical for implementing premium navigation aesthetics and ensuring proper visual hierarchy
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is visual work, not git operations
    - `typescript-programmer`: Navigation changes are primarily CSS/visual, not TypeScript logic

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 5 (Glassmorphism depends on fixed navigation)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/components/Navigation.tsx:67-72` - Current nav z-index implementation (z-50)
  - `src/components/Navigation.tsx:137` - Current backdrop z-index (z-40)
  - `src/components/Navigation.tsx:147` - Current mobile menu z-index (z-50)
  - `src/components/Navigation.tsx:78-87` - Logo and menu items vertical alignment pattern

  **API/Type References** (contracts to implement against):
  - Navigation component interface (no props, internal state management)
  - usePathname hook from Next.js for active route detection

  **Test References** (testing patterns to follow):
  - Manual verification: Check z-index in browser dev tools
  - Accessibility testing: Verify screen reader announcements

  **Documentation References** (specs and requirements):
  - Toss navigation patterns: Clean layering with proper z-index hierarchy
  - Innovation Forest navigation: Premium glassmorphism effects

  **External References** (libraries and frameworks):
  - Tailwind CSS z-index utilities and best practices
  - MDN z-index documentation for proper stacking context

  **WHY Each Reference Matters** (explain the relevance):
  - Navigation.tsx lines: Show current problematic z-index values that need fixing
  - Logo alignment pattern: Ensures visual consistency when updating navigation
  - Toss/Innovation Forest: Provide premium aesthetic inspiration for implementation

  **Acceptance Criteria**:

  > CRITICAL: Acceptance = EXECUTION, not just "it should work".
  > The executor MUST run these commands and verify output.

  **Manual Execution Verification:**

  **For Navigation/Layout changes:**
  - [ ] Using browser dev tools:
    - Navigate to: `http://localhost:3000`
    - Open dev tools: Inspect navigation element
    - Verify: nav bar has `z-index: 60` (or z-60 in computed styles)
    - Verify: backdrop has `z-index: 50`
    - Verify: mobile menu has `z-index: 55`
  - [ ] Mobile menu test:
    - Resize to mobile (<768px)
    - Click menu button to open mobile menu
    - Verify: backdrop appears behind mobile menu
    - Verify: clicking backdrop closes menu
  - [ ] Accessibility check:
    - Use screen reader (VoiceOver/NVDA)
    - Verify: menu state changes announced properly
  - [ ] Screenshot: Save evidence to `.sisyphus/evidence/navigation-z-index.png`

  **Evidence Required:**
  - [ ] Dev tools screenshot showing z-index values
  - [ ] Mobile menu layering screenshot
  - [ ] Accessibility test results

  **Commit**: NO (groups with Task 2)

- [ ] 2. Enhance Hero Section Layout

  **What to do**:
  - Fix h1 text stacking issue in hero grid
  - Improve floating cards positioning and shadows
  - Ensure responsive grid layout works properly
  - Add proper spacing to prevent text overlap

  **Must NOT do**:
  - Change hero content or messaging
  - Add JavaScript animations (CSS only)
  - Break mobile responsiveness

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Premium UI layout and design implementation
    - Reason: Hero section is the main visual focal point requiring precise layout work
  - **Skills**: [`frontend-ui-ux`] - Essential for premium hero section design and responsive layouts
    - `frontend-ui-ux`: Critical for implementing Toss/Innovation Forest inspired hero aesthetics
  - **Skills Evaluated but Omitted**:
    - `typescript-programmer`: Layout changes are primarily CSS/styling, not TypeScript logic

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 5 (Glassmorphism integration)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/app/page.tsx:99-216` - Current hero section implementation
  - `src/app/page.tsx:107` - Grid layout `lg:grid-cols-2` pattern
  - `src/app/page.tsx:115-121` - h1 text structure (potential stacking issue)
  - `src/app/page.tsx:188-212` - Floating cards absolute positioning
  - `src/app/page.tsx:149-186` - Main hero card structure

  **External References**:
  - CSS Grid best practices for responsive layouts
  - Toss hero section patterns: Clean typography hierarchy
  - Innovation Forest hero: Premium card designs with proper shadows

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  **For Hero Section changes:**
  - [ ] Using browser testing:
    - Navigate to: `http://localhost:3000`
    - Test desktop (>1024px): Verify grid layout, text doesn't overlap
    - Test tablet (768px-1023px): Verify responsive behavior
    - Test mobile (<768px): Verify single column layout
  - [ ] Floating cards verification:
    - Verify cards positioned correctly without overlap
    - Check shadows are appropriate for premium aesthetic
    - Ensure cards scale properly on different screen sizes
  - [ ] Text overlap test:
    - Zoom browser to 200% on desktop
    - Verify h1 and other text elements don't stack/overlap
    - Check navigation doesn't overlap hero content
  - [ ] Screenshot: Save evidence to `.sisyphus/evidence/hero-layout.png`

  **Evidence Required:**
  - [ ] Responsive test screenshots (desktop, tablet, mobile)
  - [ ] Text overlap test screenshot at 200% zoom
  - [ ] Floating cards positioning verification

  **Commit**: YES (group with Task 1)
  - Message: `fix(navigation): resolve z-index conflicts and hero layout issues`
  - Files: `src/components/Navigation.tsx`, `src/app/page.tsx`
  - Pre-commit: Manual browser verification

- [ ] 3. Upgrade Global Styles to HSL Color System

  **What to do**:
  - Convert hex colors to HSL in globals.css
  - Update color variables for better manipulation
  - Maintain WCAG AA contrast requirements
  - Preserve existing color semantics

  **Must NOT do**:
  - Change color semantics (success stays success, etc.)
  - Break existing component color usage
  - Reduce color contrast below accessibility standards

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Color system and design implementation
    - Reason: Color system is core to visual design requiring expertise
  - **Skills**: [`frontend-ui-ux`] - Essential for professional color palette design
    - `frontend-ui-ux`: Critical for implementing Toss/Innovation Forest inspired premium colors
  - **Skills Evaluated but Omitted**:
    - `typescript-programmer`: Color system changes are CSS-only, no TypeScript changes needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 4 (Micro-interactions use new colors), Task 5 (Glassmorphism)
  - **Blocked By**: Task 1, Task 2 (navigation and hero fixes should use new color system)

  **References**:

  **Pattern References**:
  - `src/app/globals.css:19-55` - Current hex color system
  - `src/app/globals.css:77-88` - Text color variables
  - `src/app/globals.css:91-93` - Border color variables
  - `src/components/Navigation.tsx:70` - Current navigation colors
  - `src/app/page.tsx:99` - Hero section background colors

  **External References**:
  - HSL color space benefits for design systems
  - Toss color palette: Sophisticated HSL-based colors
  - Innovation Forest colors: Premium gradient combinations
  - WCAG AA contrast requirements (minimum 4.5:1 for normal text)

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  **For Color System changes:**
  - [ ] Using browser dev tools:
    - Navigate to: `http://localhost:3000`
    - Inspect CSS variables: Verify HSL values (e.g., `hsl(210, 40%, 96%)`)
    - Test color contrast: Use dev tools contrast checker
    - Verify all text meets WCAG AA (4.5:1 minimum)
  - [ ] Color manipulation test:
    - Check that colors can be easily manipulated with CSS filters
    - Verify transparency works properly with new HSL values
    - Test gradients and color combinations
  - [ ] Cross-browser test:
    - Test in Chrome, Firefox, Safari
    - Verify color consistency across browsers
  - [ ] Screenshot: Save evidence to `.sisyphus/evidence/hsl-colors.png`

  **Evidence Required:**
  - [ ] Dev tools screenshot showing HSL values
  - [ ] Color contrast checker results
  - [ ] Cross-browser color comparison screenshot

  **Commit**: NO (groups with Task 4)

- [ ] 4. Add Micro-Interaction Utilities

  **What to do**:
  - Add hover scale utilities to globals.css
  - Implement pulse effect utilities
  - Add smooth transition utilities for premium feel
  - Ensure performance with CSS transforms instead of position changes

  **Must NOT do**:
  - Add JavaScript animation libraries
  - Use CSS position for animations (use transform)
  - Create performance-heavy animations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Micro-interactions and animation implementation
    - Reason: Micro-interactions require precision animation expertise
  - **Skills**: [`frontend-ui-ux`] - Critical for implementing premium micro-interactions inspired by Toss
    - `frontend-ui-ux`: Essential for creating smooth, professional animations that enhance UX
  - **Skills Evaluated but Omitted**:
    - `typescript-programmer`: Micro-interactions are CSS-based utilities, no TypeScript needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 5 (Glassmorphism uses micro-interactions)
  - **Blocked By**: Task 3 (new color system used in micro-interactions)

  **References**:

  **Pattern References**:
  - `src/app/globals.css:241-287` - Existing animation keyframes
  - `src/app/globals.css:135-144` - Existing duration and easing variables
  - `src/components/Navigation.tsx:98-104` - Current hover states pattern
  - `src/app/page.tsx:252` - Current hover transitions example

  **External References**:
  - CSS performance best practices (use transform, avoid layout thrashing)
  - Toss micro-interactions: Subtle, premium feel with proper easing
  - Innovation Forest: Smooth entrance animations and hover effects
  - MDN CSS transitions and transforms documentation

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  **For Micro-Interaction changes:**
  - [ ] Using browser testing:
    - Navigate to: `http://localhost:3000`
    - Test hover effects: Verify smooth scaling on interactive elements
    - Check performance: Use dev tools performance tab, ensure 60fps animations
    - Verify transforms used: Check computed styles for `transform` instead of `position`
  - [ ] Utility class testing:
    - Add test classes to elements and verify behavior
    - Test hover scales: `.hover-scale-105` should scale to 1.05
    - Test pulse effects: `.pulse-slow` should have smooth pulse animation
  - [ ] Performance verification:
    - Use Chrome dev tools: Rendering tab, check for layout shifts
    - Verify no layout thrashing during animations
    - Test on lower-end devices if possible
  - [ ] Screenshot: Save evidence to `.sisyphus/evidence/micro-interactions.png`

  **Evidence Required:**
  - [ ] Dev tools performance metrics screenshot
  - [ ] Hover effect demonstration screenshots
  - [ ] Animation performance verification

  **Commit**: YES (group with Task 3)
  - Message: `feat(styles): add HSL color system and micro-interaction utilities`
  - Files: `src/app/globals.css`
  - Pre-commit: Manual browser verification and performance check

- [ ] 5. Premium Glassmorphism Implementation

  **What to do**:
  - Implement premium glassmorphism effects for navigation
  - Add glassmorphism to hero cards and floating elements
  - Use proper backdrop-blur and transparency values
  - Ensure effects work across browsers with fallbacks

  **Must NOT do**:
  - Overdo effects to hurt readability
  - Create performance issues with heavy blur effects
  - Break accessibility with poor contrast

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` - Advanced visual effects implementation
    - Reason: Glassmorphism requires sophisticated visual design expertise
  - **Skills**: [`frontend-ui-ux`] - Critical for implementing Toss-inspired premium glassmorphism
    - `frontend-ui-ux`: Essential for creating professional glassmorphism that enhances rather than distracts
  - **Skills Evaluated but Omitted**:
    - `typescript-programmer`: Glassmorphism is CSS-based visual styling, no TypeScript needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final task)
  - **Blocks**: None (final polish task)
  - **Blocked By**: Tasks 1, 2, 3, 4 (requires fixed layout, new colors, and micro-interactions)

  **References**:

  **Pattern References**:
  - `src/components/Navigation.tsx:70` - Current glassmorphism attempt `bg-white/95 backdrop-blur-md`
  - `src/app/globals.css:109-121` - Existing shadow system for enhancement
  - `src/app/globals.css:135-144` - Existing duration and easing for smooth transitions
  - `src/app/page.tsx:149` - Hero card that needs glassmorphism upgrade
  - `src/app/page.tsx:189, 202` - Floating cards for glassmorphism effects

  **External References**:
  - CSS backdrop-filter browser support and fallback strategies
  - Toss glassmorphism patterns: Premium but subtle blur effects
  - Innovation Forest: Sophisticated glass cards with proper layering
  - Glassmorphism design best practices: Contrast, readability, performance

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  **For Glassmorphism changes:**
  - [ ] Using browser testing:
    - Navigate to: `http://localhost:3000`
    - Test navigation: Verify premium glassmorphism with proper blur
    - Test hero cards: Check glassmorphism effects on main and floating cards
    - Verify backdrop content shows through with appropriate blur
  - [ ] Cross-browser verification:
    - Test Chrome, Firefox, Safari, Edge
    - Verify fallbacks work on browsers without backdrop-filter support
    - Check performance impact of blur effects
  - [ ] Accessibility testing:
    - Verify text contrast remains WCAG AA compliant with glassmorphism
    - Test with screen readers to ensure effects don't interfere
    - Check reduced motion preferences are respected
  - [ ] Performance verification:
    - Use dev tools: Check for excessive GPU usage
    - Test scroll performance with glassmorphism elements
    - Verify no jank during interactions
  - [ ] Screenshot: Save evidence to `.sisyphus/evidence/glassmorphism.png`

  **Evidence Required:**
  - [ ] Glassmorphism effect screenshots (navigation, hero cards)
  - [ ] Cross-browser compatibility verification
  - [ ] Accessibility contrast test results
  - [ ] Performance metrics for blur effects

  **Commit**: YES (final commit)
  - Message: `feat(ui): implement premium glassmorphism effects`
  - Files: `src/components/Navigation.tsx`, `src/app/page.tsx`, `src/app/globals.css`
  - Pre-commit: Full browser verification across devices

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1+2 | `fix(navigation): resolve z-index conflicts and hero layout issues` | Navigation.tsx, page.tsx | Manual browser verification |
| 3+4 | `feat(styles): add HSL color system and micro-interaction utilities` | globals.css | Color contrast & performance check |
| 5 | `feat(ui): implement premium glassmorphism effects` | Navigation.tsx, page.tsx, globals.css | Cross-browser & accessibility testing |

---

## Success Criteria

### Verification Commands
```bash
# Build verification
npm run build  # Expected: Build passes without errors

# Development server
npm run dev  # Expected: Server starts successfully
```

### Final Checklist
- [ ] Navigation z-index hierarchy: nav (60) > mobile menu (55) > backdrop (50)
- [ ] Hero section text never overlaps navigation on any screen size
- [ ] Grid layout responsive: mobile (1 col), tablet (1-2 col), desktop (2 col)
- [ ] Color system converted to HSL with WCAG AA contrast maintained
- [ ] Micro-interactions smooth and performant (60fps)
- [ ] Glassmorphism premium quality with proper blur and transparency
- [ ] Build passes without errors
- [ ] Cross-browser compatibility verified
- [ ] Accessibility features preserved and enhanced
- [ ] Performance maintained or improved