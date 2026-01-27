# Sound Effects (SFX)

This directory contains 8-bit style sound effects for the Answer Feedback System.

## Files

- `correct.mp3` - Positive feedback sound (plays on correct answer)
- `incorrect.mp3` - Negative feedback sound (plays on incorrect answer)

## Specifications

- **Format**: MP3 (web-compatible)
- **Duration**: ~200-500ms (short, snappy)
- **Style**: 8-bit / chiptune (matches retro game aesthetic)
- **Volume**: Played at 20% (0.2) by default

## Sources

Sound effects should be royalty-free. Recommended sources:
- [OpenGameArt.org](https://opengameart.org/) (CC0/CC-BY)
- [Freesound.org](https://freesound.org/) (CC0 filter)
- [BFXR](https://www.bfxr.net/) (generate your own 8-bit sounds)

## Usage

These files are loaded by the `useAnswerFeedback` hook in `src/hooks/useAnswerFeedback.ts`.
