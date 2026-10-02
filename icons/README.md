# Common Ground icons

36 standalone SVG icons, three colored posture variants, and one reusable symbol sprite. No font, library, or build step required. Open [preview.html](preview.html) to search, resize, switch paper color, copy SVG markup, or download individual assets.

## Construction

- Canvas: `0 0 32 32`.
- Stroke: 3 units, square line caps, miter joins.
- Color: `currentColor`; default fill: none.
- Scale: 32 px is native, 48 px is expressive, 64 px is display. At 24 px the stroke scales to 2.25 px. Avoid shrinking below 24 px.
- Offset shadows have zero blur. Use a small diagonal lean or offset when an icon needs to suggest motion. Preserve clarity for functional controls.

## Use inline

Copy any SVG's markup into HTML. Set the surrounding text color to choose its ink. For decorative icons inside a labeled button, add `aria-hidden="true"` to the SVG. For a meaningful standalone graphic, add `role="img"` and an `aria-label`. Give icon-only buttons an accessible name on the button.

```html
<button aria-label="Download file">
  <svg viewBox="0 0 32 32" width="32" height="32"
       fill="none" stroke="currentColor" stroke-width="3"
       stroke-linecap="square" stroke-linejoin="miter"
       aria-hidden="true">
    <path d="M16 4v17m-7-7 7 7 7-7M4 23v5h24v-5"/>
  </svg>
</button>
```

## Use the sprite

Serve the files from the same origin. External SVG symbols may be restricted on `file://`; inline SVG works without a server.

```html
<svg width="32" height="32" aria-hidden="true">
  <use href="icons/sprite.svg#cg-arrow-up-right"></use>
</svg>
```

All symbol IDs start with `cg-`, followed by the filename without `.svg`.

## Use standalone assets

```html
<img src="icons/ask.svg" width="32" height="32" alt="Ask">
<img src="icons/persona/ask.svg" width="64" height="64" alt="Ask">
```

An SVG loaded with `img` uses its own ink color; it does not inherit the parent's `currentColor`. Inline it when you need themed colors.

## Color has a job

Default icons are monochrome. Colored variants in `persona/` add color only to the posture boundary:

| Posture | Geometry | Role | Color |
| --- | --- | --- | --- |
| GIVE | Sharp upper edge, rounded lower boundary | Data and giving | Azure `#3897db` |
| ASK | Envelope | Questions and invitations | Sky `#abd4e9` |
| SPEAK | Punched tag | Human expression | Pink `#e9a8c7` |
| PRESS | Offset keycap | Action and potential | Paper and ink |

Inline persona SVGs support `--azure`, `--sky`, `--pink`, and `--icon-ink` overrides. Paper-dependent glyphs support `--icon-paper` for inverted contexts.

Burnt orange `#c4512e` belongs to one specialized focal accent per composition. The preview uses it once. Do not color every action orange.

## Inventory

- **Postures:** `give`, `ask`, `speak`, `press`.
- **Direction:** `arrow-up-right`, `arrow-right`, `arrow-left`, `arrow-down`, `external-link`, `refresh`.
- **Actions:** `plus`, `minus`, `close`, `check`, `search`, `edit`, `download`, `upload`, `copy`, `link`, `play`, `pause`.
- **Structure:** `menu`, `grid`, `home`, `folder`, `file`, `filter`, `chart`.
- **Human:** `person`, `hand`, `heart`.
- **Tension:** `spark`, `conflict`, `move`, `offset`.

## Future additions

Start from this canvas and stroke grammar. Give a new icon one clear job. Use GIVE, ASK, SPEAK, or PRESS only when its posture reflects the interaction. Keep utilitarian glyphs monochrome. Let an occasional offset, unequal line, or crossed axis carry the conflict without obscuring meaning. Respect reduced-motion preferences if animating an icon.
