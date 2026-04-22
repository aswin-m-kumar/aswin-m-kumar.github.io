# Mobile QA Checklist

Use this checklist after responsive changes to verify the portfolio on real devices or browser device emulation.

## Automated Checks Run Locally

- [x] `node --check script.js`
- [x] Inline script syntax checks for `experience.html`, `game.html`, and `orbital-dodge.html`
- [x] Git whitespace check with CRLF-aware config
- [x] Static HTML checks for viewport meta tags, duplicate IDs, and local asset references

## Target Viewports

- [ ] iPhone SE: 375px wide
- [ ] iPhone 14/15: 390px wide
- [ ] iPhone Plus/Max: 428px wide
- [ ] Small Android: 360px wide
- [ ] iPad Mini portrait: 768px wide
- [ ] iPad Pro landscape: 1024px wide

## Navigation

- [ ] Hamburger button is at least 44px by 44px.
- [ ] Mobile menu opens and closes without page scroll bleed.
- [ ] Menu closes on link tap.
- [ ] Menu closes on outside tap.
- [ ] Menu closes with Escape on desktop/tablet keyboards.
- [ ] Menu closes with the mobile swipe gesture.
- [ ] Menu height fits inside the visible browser viewport.

## Homepage Hero

- [ ] Profile image remains contained on 360px to 480px widths.
- [ ] Floating cards stack cleanly without overlap.
- [ ] Terminal text wraps without horizontal scrolling.
- [ ] Social proof items wrap cleanly with readable spacing.
- [ ] Primary and secondary hero buttons have comfortable touch targets.

## Content Cards

- [ ] Project cards do not overflow on 360px screens.
- [ ] Skills tags wrap into multiple rows with consistent gaps.
- [ ] Certificate cards fit full width on mobile.
- [ ] Certificate buttons stretch and remain readable.
- [ ] Experience timeline spine stays near the left edge on mobile.
- [ ] Experience cards and tags do not overlap the timeline.

## Contact

- [ ] Contact info items stack vertically on small screens.
- [ ] Email, LinkedIn, GitHub, and Instagram links wrap without overflow.
- [ ] Form inputs are full width.
- [ ] iOS does not zoom when inputs receive focus.
- [ ] Submit button is at least 48px tall.
- [ ] Form success and error states remain visible and readable.

## Games

- [ ] Circuit Master canvas stays square and fits the viewport.
- [ ] Circuit Master tile taps rotate the expected tile.
- [ ] Circuit Master Rotate Selected button works on touch devices.
- [ ] Circuit Master can advance through all levels.
- [ ] Orbital Dodge canvas fills the viewport without browser scrolling.
- [ ] Orbital Dodge tap input changes orbit direction.
- [ ] Game modals fit within 95% width and scroll internally if needed.

## Performance

- [ ] Mobile scroll remains smooth on long project/certificate/experience pages.
- [ ] Hover/tilt effects do not stick on touch devices.
- [ ] Blur-heavy backgrounds are reduced on mobile.
- [ ] Off-screen long lists do not cause visible layout jumps.

## Final Pass

- [ ] No horizontal scrolling on any primary page.
- [ ] Text does not overlap controls or cards.
- [ ] Buttons and links remain readable in dark and light themes.
- [ ] Theme toggle works after opening and closing the mobile menu.
- [ ] Footer is reachable and not hidden behind viewport/browser UI.
