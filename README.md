# llevan

A responsive, interactive design-language specimen. Built with HTML, CSS, and JavaScript; no build step or dependencies.

Open [the standalone motion film](demo.html) for a 24-second animated introduction to the language. Six chapters convey order, purposeful shapes, color personalities, productive friction, physical impulse, and common ground. Includes play/pause, replay, speed selection, scrubbing, chapter selection, keyboard controls, responsive layouts, and reduced-motion support. The film uses local assets and system fonts and works offline.

The film includes an original Web Audio score that follows the chapters, with a different playable sound and motion for each shape. Click a form or press **G** (give), **A** (ask), **S** (speak), **Enter** (press), or **X** (friction). Hidden forms are revealed in their chapter when triggered by a shortcut. **K** toggles the visible keycaps; **M** toggles sound. Sound starts with a playback or shape interaction, and has mute and volume controls. Music pauses with playback, scrubbing, or a hidden tab. No audio downloads or external services are required.

The arrangement builds across six chapters at 120 BPM: stereo plucked arpeggios, warm extended chords, syncopated bass, kick/snare/hi-hat percussion, a layered melody, and a resolving finale. Filtered echoes follow the selected tempo; a synthesized stereo room adds depth. Music and its reverb tails fade out on pause. Continuous spring motion, orbital marks, flowing color trails, beat pulses, and a timeline-driven rhythm display accompany the score. Reduced-motion preferences keep decorative reactions and the rhythm display still.

The standalone film fills the browser viewport. Shapes travel between compositions across the whole screen, with chapter typography and a compact playback dock overlaid above the artwork. Motion paths adapt on resize for desktop and mobile; shorter screens use smaller forms and compact controls.

The opening introduction presents llevan in three animated acts: order, opposition, and common ground. Blue structure, pink personality, and a burnt-orange interruption move against a visible grid. Select a chapter to pause at that act, then use Play to continue. The introduction shares the specimen's timeline, speed, replay, and reduced-motion behavior. Its layout adapts from a two-column poster to a stacked mobile composition.

The main page is also a motion demo: a shared twelve-second loop choreographs typography, geometry, the four posture shapes, grid tension, persona colors, physical shadows, and all 36 icons. Use the sticky transport to pause, replay, change speed, or scrub the timeline. Click a posture or icon for an extra push. Reduced-motion preferences disable autoplay; Play explicitly starts the demo. Playback suspends while the browser tab is hidden.

Open `index.html` in a browser, or serve this directory with `python3 -m http.server 8000` and visit http://localhost:8000.

Includes animated geometric artwork, four interactive posture specimens, a toggleable twelve-column grid, responsive layouts, keyboard focus states, and reduced-motion support. Google Fonts are optional; system fonts work offline.

## SVG icon toolkit

Browse [the icon workshop](icons/preview.html): 36 standalone SVGs, three persona color variants, and an SVG sprite. Search, resize, copy markup, or download assets. See [the usage guide](icons/README.md) for construction rules, accessible usage, and future additions.
