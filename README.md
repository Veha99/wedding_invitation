# Wedding Invitation Website — Cream & Gold 🌿

A fully editable, responsive wedding invitation website with:
- Envelope opening animation and scroll-reveal effects
- Looping solo piano background music (starts after opening, toggle on/off)
- Hero portrait, story photos and six-photo lightbox gallery
- Wedding countdown and event details
- Google Maps directions link, downloadable calendar event (.ics)

## 1. Open the website

Double-click `index.html` in a web browser. Click **Open the invitation**.
Alternatively, run a local web server in this directory:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. The site is plain HTML/CSS/JavaScript — no npm install, build or backend required for preview.

## 2. Replace the sample wedding details (IMPORTANT)

Edit `wedding-config.js` with any text editor:

- `person1`, `person2`, `shortName1`, `shortName2`, `initials`
- `weddingDate` (ISO 8601 with timezone, e.g. `2027-02-20T16:00:00+07:00`)
- `weddingDayLabel`, `ceremonyTime`, `receptionTime`
- `venueName`, `venueAddress`, `mapsLink`

The shipped date, time, names and venue are **sample content**, not verified wedding facts. They must be updated before inviting guests. If publishing, also remove the demo ribbon from `index.html`.

## 3. Add your own photos

Place JPEG/WebP files inside `assets/images/`, such as:

```
assets/images/couple-1.jpg
assets/images/couple-2.jpg
assets/images/couple-3.jpg
assets/images/couple-4.jpg
assets/images/couple-5.jpg
assets/images/couple-6.jpg
```

Then edit the `photos` array in `wedding-config.js` to use these exact paths. Stock Unsplash URLs are sample photos only, require a network connection, and show people who are **not** the couple named in the invitation. Replace them before publishing.

## 4. Background music

The invitation uses `assets/audio/gentle-wedding-piano.mp3`, “Wedding” by The_Mountain, downloaded from [Pixabay](https://pixabay.com/music/solo-piano-wedding-455512/) under the [Pixabay Content License](https://pixabay.com/service/license-summary/). Visitors must click **Open the invitation** for music to begin, due to browser autoplay restrictions. To use another track, put its licensed `.mp3` in `assets/audio/` and update `musicFile` in `wedding-config.js`.

## 5. Hosting

This is a static site and can be hosted on Netlify, GitHub Pages, or another static hosting provider. No backend or npm install is required.

## 6. Files

```
wedding-invitation/
├── index.html             # invitation page markup
├── styles.css             # theme, responsiveness and animations
├── wedding-config.js      # easy-to-edit wedding data and photo URLs
├── script.js              # music, countdown, photos, calendar, sharing
├── ├── assets/
│   ├── audio/
│   │   └── gentle-wedding-piano.mp3
│   └── images/             # your personal photos can go here
└── README.md
```

## Accessibility notes

Keyboard controls: Enter to open, Tab through interactive controls, Esc to close gallery, Left/Right arrows to navigate photos. Animation respects `prefers-reduced-motion`. Audio is optional and can be paused.

### Credits

Sample image URLs use [Unsplash](https://unsplash.com/license). Remove or replace demo images with your own photos. The design, implementation, and music in this package were created as an original template; it is not a copy of the linked site's code.
