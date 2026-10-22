# Sprite Lab and Atlas Bench QA

## Files

- `tools/sprite-lab/index.html`: original procedural demon sprite prototype and PNG/JSON exporters.
- `tools/sprite-lab/atlas-bench.html`: local-only atlas/manifest validation and playback.
- `docs/game-design/sprite-tool-stack.md`: selected upstream tool roles and license cautions.

## Fast validation workflow

1. Open `tools/sprite-lab/index.html` in a modern browser.
2. Choose a silhouette, palette, eye count, horns, and body scale. Preview idle, move, attack, and hit states.
3. Export the transparent PNG and JSON manifest from the same settings.
4. Open `tools/sprite-lab/atlas-bench.html`.
5. Select both exported files. Resolve any validation errors before importing.
6. Play each animation at its intended speed and inspect the frame-by-frame output.
7. Test at 1x and at the approximate on-screen size expected during combat. Check that the character remains readable against soot, lava, and enemy effects.

## Expected prototype contract

- Atlas: 512 × 512 pixels, transparent background.
- Frame cell: 128 × 128 pixels.
- Grid: four columns by four rows.
- Rows: `idle`, `move`, `attack`, `hit`.
- Each animation contains four frames.
- Exported foot anchor: `{ x: 64, y: 104 }`, a provisional lower-center anchor. Confirm this against the actual game renderer and collision/body origin before production use.
- Frame rectangles must stay within the image, match the declared cell size, and line up with the declared animation row.

## Manual QA checklist

- [ ] PNG background is genuinely transparent, not a baked checkerboard.
- [ ] Manifest and PNG came from the same export.
- [ ] All four animations load without clipping or incorrect rows.
- [ ] Feet/anchor remain stable enough to avoid visible ground sliding.
- [ ] Attack anticipation, active pose, and recovery read clearly at gameplay zoom.
- [ ] Hit reaction is visible without confusing it for an attack.
- [ ] Sprite outline and accent colors remain readable on dark terrain and bright lava.
- [ ] Animation timing does not make non-looping states repeat unexpectedly.
- [ ] Upstream code and art licenses are reviewed independently before redistribution.

## Current limitations

This is a developer-only prototype workflow, not a production game integration. Atlas Bench validates structural consistency and provides playback; it cannot judge art quality or guarantee compatibility with an engine-specific animation system. The files have been committed to GitHub, but this environment has not run them in a full graphical browser or connected them to the ARPG renderer. Do not mark browser QA or game integration complete until those tests actually happen.
