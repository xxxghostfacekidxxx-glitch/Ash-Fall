# Ash-Fall Game Asset Pipeline

Status: research and integration plan. No third-party tool or asset is considered approved for shipping until tested and its code/assets/licenses have been audited.

## Creative target

Ash-Fall's game art should be an original, readable, grotesque-cartoon demon apocalypse: bold silhouettes, expressive faces, heavy graphic outlines, vivid toxic accents against soot and ember colors, exaggerated animation, and readable isometric combat. References are tonal only; do not copy protected characters, sprites, logos, or exact designs.

## Candidate repositories

### 1. sprite-gen
- Repository: https://github.com/aldegad/sprite-gen
- Reported code license: Apache-2.0.
- Role to evaluate: turn approved character illustrations into cleaned transparent frames and game-ready animation atlases.
- Caveat: some generation paths rely on external model providers/accounts. Do not assume every path is free or offline.
- Integration approach: keep it as a development-time asset tool, not a runtime dependency. Preserve LICENSE and any NOTICE/attribution files; mark modifications.

### 2. pixel-asset-gen
- Repository: https://github.com/MozeeB/pixel-asset-gen
- LICENSE checked: MIT.
- Role to evaluate: procedural baseline for characters, enemies, terrain, effects, items, animation sheets, and metadata.
- Caveat: current visual style is not automatically Ash-Fall's final art direction. Prototype, customize, and visually review outputs before adoption.
- Integration approach: vendor only the required code/assets after checking all bundled asset provenance, preserve the MIT notice, and record changes.

### 3. PixelForge
- Repository: https://github.com/KodoRe/pixel-forge
- Role to evaluate: lightweight JavaScript procedural sprites, palettes, compositing, animation, and spritesheet export for browser-native tools.
- Caveat: verify the current repository's license file and dependencies before vendoring. The repository description reports MIT, but a missing or unverified LICENSE must be resolved before copying.
- Integration approach: evaluate as a small isolated prototype first.

### 4. Universal-LPC-Modern-Sprite-Generator
- Repository: https://github.com/codyaboyd/Universal-LPC-Modern-Sprite-Generator
- Reported software license: GPL-3.0; its asset catalog includes multiple licenses.
- Role to evaluate: reference implementation for layered character customization, equipment compatibility, palette recoloring, animation previews, and export metadata.
- Caveat: do not import its art or code into the shipped game without a deliberate GPL and per-asset license review. Prefer borrowing the design pattern and implementing an Ash-Fall-native system if licensing would complicate distribution.

## Proposed approach

1. Create a consistent Ash-Fall style guide and a small art test set before bulk asset replacement.
2. Build one original customizable demon with interchangeable horns, eyes, tails, body markings, armor, weapons, and color palettes.
3. Produce the same character in idle, move, attack, hit, dodge, and defeat states. Check alignment, scale, silhouette, timing, transparency, and directional consistency.
4. Prototype one enemy, one elite enemy, one boss, one NPC, a small terrain set, projectile/effect set, and inventory icons.
5. Validate at normal gameplay zoom with many enemies on screen. Prioritize silhouette, attack telegraphs, hit feedback, and legible loot.
6. Select the best tools only after the prototypes are compared. Use development tools to generate assets; do not add generation services or API costs to the live game unless explicitly approved.
7. Keep each external tool isolated in a tools/vendor area or as a documented submodule where practical. Preserve upstream origin, exact commit/version, license, notices, modifications, and an asset manifest.
8. Audit other Ash-Fall games individually. Reuse the shared asset pipeline and UI standards, but do not force every genre into the demon ARPG's art style. Casino games, fish tables, platformers, strategy games, and RPGs need coherent genre-specific visual systems.

## Suggested directory layout

```text
tools/
  sprite-pipeline/
    README.md
    THIRD_PARTY_NOTICES.md
game-assets/
  shared/
    palettes/
    vfx/
    ui/
  demon-arpg/
    characters/
    enemies/
    bosses/
    environments/
    items/
    atlases/
    manifests/
```

This is a proposed layout, not a claim that these directories have already been created or that assets have been imported.

## Acceptance checklist

- [ ] Original art direction and palette documented
- [ ] Candidate repository licenses and dependencies verified
- [ ] Every shipped asset has a recorded source and license
- [ ] Player sprite has consistent idle/move/attack/hit/dodge/defeat states
- [ ] Animation frames share stable anchors and scale
- [ ] Alpha/background cleanup is clean at 1x and scaled resolutions
- [ ] Combat readability tested with multiple enemies and effects
- [ ] UI and sprites remain usable on mobile and desktop
- [ ] Third-party notices and modified-file notices included as required
- [ ] No unapproved paid API or hosted service required to run the shipped game

## Decision

Initial candidates for a proof-of-concept: pixel-asset-gen for broad procedural asset generation, sprite-gen for animation processing, and PixelForge for browser-native procedural customization. Do not mass-copy every repository or replace existing game assets until a representative prototype passes the checklist.
