# Card background images

Drop in-game screenshots here. They're cover-fit (cropped to fill, centered),
then a dark scrim + per-map accent is layered on top for legibility.

Expected filenames (PNG):

| File                  | Used by        | Card size  |
|-----------------------|----------------|------------|
| `stats.png`           | `/stats`       | 820 × 340  |
| `deadend.png`         | `/deadend`     | 820 × 470  |
| `badblood.png`        | `/badblood`    | 820 × 470  |
| `alienarcadium.png`   | `/alienarcadium`| 820 × 420 |
| `prison.png`          | `/prison`      | 820 × 470  |
| `leaderboard.png`     | `/leaderboard` | 620 × tall |
| `rankings.png`        | `/rankings`    | 620 × tall |
| `kills.png`           | `/kills`       | 620 × tall |
| `bosskills.png`       | `/bosskills`   | 620 × tall |

The list cards (leaderboard/rankings/kills/bosskills) are 620 wide with a
height that grows with the number of rows, so use a tall-ish source image.

Tips:
- Use landscape shots at ~2× (e.g. **1640 × 940**) so they stay crisp.
- Anything missing falls back to a tinted gradient automatically — no errors.
- Busy/bright shots still work because of the scrim, but calmer shots read best.
