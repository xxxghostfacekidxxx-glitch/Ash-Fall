# Sprite Tool Stack and Demon ARPG Art Direction

This document records the five external sprite tools we keep available for Ash-Fall's different browser games. The installer is `scripts/install-sprite-tools.sh`; it checks out each repository under `tools/sprite-tools/`. These are developer tools, not production runtime dependencies. The installer does not copy their output into the public site or silently replace existing game art.

## The two primary tools for the demon ARPG

### 1. pixel-asset-gen — procedural base assets and animation sheets
Repository: https://github.com/MozeeB/pixel-asset-gen

Use it for fast, reproducible base assets: environmental props, terrain, effects, item silhouettes, and initial enemy-animation experiments. It is MIT-licensed according to its repository. Its default art direction is Kingdom Rush-like cel-shaded pixel art, so its output is a starting material, not the final Ash-Fall look. Use curated palettes and selectively generated/reworked assets; do not simply dump the entire default asset pack into the game.

### 2. sprite-gen — production sprite cleanup and atlas pipeline
Repository: https://github.com/aldegad/sprite-gen

Use it to turn original concept art or selected generated character art into clean transparent frames, consistent animation rows, runtime atlases, and machine-readable frame manifests. Its repository states Apache-2.0. Some generation paths rely on external model providers and may incur costs; do not enable paid API calls by default. Prefer assets that can be produced locally or manually supplied unless the user explicitly approves paid generation.

Together, these tools cover repeatable starter assets plus a pipeline for clean, game-ready animation sheets. Neither replaces actual game integration, frame timing review, collision/hitbox tuning, or art QA.

## Keep all five available across the game collection

| Tool | Repository | Intended use | License / caution |
|---|---|---|---|
| sprite-gen | https://github.com/aldegad/sprite-gen | Primary ARPG atlas cleanup and animation pipeline | Apache-2.0 stated by upstream; optional generation providers can cost money |
| pixel-asset-gen | https://github.com/MozeeB/pixel-asset-gen | Primary ARPG procedural props, terrain, effects and prototype sheets | MIT stated by upstream; default visual style must be adapted |
| PixelForge | https://github.com/KodoRe/pixel-forge | Browser/JS procedural sprites, palette experiments, icons and low-cost prototypes for other games | MIT stated by upstream; verify the checked-out LICENSE before distribution |
| Universal LPC Modern Sprite Generator | https://github.com/codyaboyd/Universal-LPC-Modern-Sprite-Generator | Layered RPG characters, equipment combinations and animation previews for suitable games | Mixed licenses across included assets; audit each asset and its attribution requirements |
| SpriteBrew | https://github.com/GAlbanese09/spritebrew | Optional experimentation with AI-assisted sprite workflows | AGPL-3.0 reported upstream; review the complete license and SaaS-related terms before integrating or redistributing |

The installer obtains the upstream repositories; it does not grant permission to redistribute every asset they contain. Keep the upstream license, notices, and per-asset attribution with any vendored or shipped output. Treat generated output as needing its own provenance record.

## Ash-Fall demon ARPG art brief

The visual target is an original, highly readable, isometric action RPG set in a burnt post-apocalyptic world. The tone combines grotesque cartoon expressiveness, manic absurdity, unsettling silhouettes, and brutal dark comedy. Use the cited works only as high-level inspiration; do not reproduce their characters, exact designs, logos, dialogue, or recognizable signature elements.

### Visual rules
- Strong, distinct silhouettes readable at gameplay zoom; oversized expressions and deliberately strange proportions.
- Thick, clean contour lines; shapes should feel hand-designed rather than generic fantasy clip-art.
- Soot black, ash grey, bone, ember orange, toxic lime, bruised violet and hot magenta as controlled accent colors.
- Damage, fire and spell effects must read clearly against dark ground; never rely on hue alone to distinguish hazards.
- Use limited palette families per faction and biome. Factions can be ridiculous, but their visual language and combat behavior must be coherent.
- Build animation states around gameplay readability: idle, move, attack wind-up, attack impact, hit, dodge, death, and interaction. Add extra expressive loops only after core states are clean.
- Keep the world weird but patterned. Props, architecture, enemies and UI should all imply a consistent, discoverable world rather than random visual noise.

### Pipeline gates
1. Create or select one original character concept and lock its proportions, palette and view angle.
2. Generate a small test sheet with idle, movement, attack and hit states.
3. Inspect transparent edges, silhouette consistency, frame alignment, foot anchors, loop seams and readability at the actual game zoom.
4. Export a manifest/atlas and connect it to the game's existing renderer before expanding the roster.
5. Test on both dark and bright backgrounds, at mobile and desktop sizes.
6. Only after the test passes, produce themed variants and expand the shared asset library.

## Installation

From a local clone of Ash-Fall:

```bash
bash scripts/install-sprite-tools.sh
```

This clones or fast-forward-updates the five upstream repositories. It requires Git and network access. It does not install Python dependencies, run model generation, add assets to the public bundle, or change existing game files.

## Important implementation status

The installer and this selection guide are committed to Ash-Fall. The upstream tools are not copied into the repository by this commit, and no existing game assets have been replaced. Run the installer in a local checkout to retrieve the source repositories; then review licenses and test the selected two-tool pipeline before integrating any generated output.
