# ProofMatch AI — Company X Tower Explorer

## Included in this full project

The previous full project already had a six-floor Company X Tower and a floor directory. This release keeps them and improves floor-to-floor exploration.

### Added
- Interactive 3D-styled exterior building model with clickable floors 1–6.
- In-world elevator at the same location on every floor, with two sliding doors, a lit indicator and interactive lift controls.
- Destination selection between any pair of floors and a short transition overlay.
- Floor navigation available through both the exterior building and the accessible directory.
- Building-wide visited location count saved in browser-local state; current-floor discoveries remain separately saved.
- Additional curated interface translations for English, Malay, Tamil and Mandarin.
- Regression tests for elevator points, controls, styling, and localization.

### Navigation
`/demo/career/company`

### Controls
- **W/A/S/D**: move through current floor.
- **Mouse drag**: look around; **double click**: capture/release mouse.
- **E**: interact with a nearby glowing department or elevator.
- **Floor buttons / building model**: switch floors without walking to the lift.
- **Esc**: leave mouse capture or close an interaction.
- Touch controls are available on mobile.

### Important scope
Company X is a fictional demonstration company. Each level is a separately rendered 3D workplace within one building exploration experience, connected by a simulated lift transition. This is not a continuous multi-story physics environment. Candidate/HR views, original MATCH logic, Job Hunt Copilot, Résumé Tailor, Cover Letter Generator, Telegram, and all previous modules remain in the source tree. No database was added.
