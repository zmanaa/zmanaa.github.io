# Leaf shadows (archived)

Foliage shadows behind the page: diagonal bands that sway in a slow wind and are gently brushed aside by the cursor,
plus a film grain. Removed from the live site when it went day-only, kept here to bring back later.

- `leafshadow.js`: the canvas animation (light and dark presets, wind, cursor interaction, grain)
- `leafshadow.css`: placement, blur and grain layer
- `dark-theme.css`: the dark theme tokens and toggle button styles
- `theme-toggle.js`: saves and applies the theme, adds the toggle button

## Re-enable the shadows
Add to `_layouts/default.html`, before the Google Analytics include:

```html
<link rel="stylesheet" href={{ "/assets/css/leafshadow.css" | prepend: site.baseurl }}>
<script src={{ "/assets/js/leafshadow.js" | prepend: site.baseurl }}></script>
```

and copy the two files back into `assets/css/` and `assets/js/`. The page background must be painted on `<html>`
(it is in `assets/css/theme.css`) so the canvas can sit behind the content.

This folder is listed under `exclude:` in `_config.yml`, so it is not published.
