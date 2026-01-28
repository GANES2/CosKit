# TODO: Make Frontend Responsive and Lightweight

## Information Gathered
- Current site uses Bootstrap (heavy), multiple fonts (Outfit + Playfair), heavy effects (grain overlay, aura blobs, backdrop-filter, tilt/magnetic on desktop).
- Responsiveness is in style.css with media queries.
- JS has advanced features like tilt, magnetic, custom cursor.
- Images are JPG/PNG, some lazy loaded.
- User wants vanilla HTML/CSS/JS, one font family (Inter 400,600), SVG icons, mobile-first, Flex/Grid, clamp(), minimal JS, no heavy effects.

## Plan
- Remove Bootstrap from HTML.
- Update fonts to Inter (400,600).
- Use mini CSS framework: container, grid, spacing, clamp.
- Rewrite CSS mobile-first: use clamp for fonts, Flex/Grid, max-width, %, rem.
- Remove heavy effects: grain overlay, aura blobs, backdrop-filter, tilt/magnetic/custom cursor.
- Simplify animations to transform/opacity.
- Keep essential JS: slider, menu, theme toggle, scroll reveal.
- Ensure all images have loading="lazy" and decoding="async".
- Adapt HTML structure to vanilla.

## Dependent Files to Edit
- index.html: remove Bootstrap, update fonts to Inter, add loading attributes.
- css/style.css: complete rewrite with mini framework.
- js/main.js: remove tilt, magnetic, custom cursor; keep slider, menu, theme, reveal.

## Followup Steps
- Test responsiveness on different screen sizes.
- Check performance with Lighthouse.
- Optimize images to WebP if needed.
