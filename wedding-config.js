/* =========================================================
   EDIT YOUR WEDDING DETAILS HERE
   All names, dates, times and the location below are SAMPLE
   values for the demo. Replace them before sharing the link.
   ========================================================= */
window.WEDDING_CONFIG = {
  person1: 'Thorng RattanakVeha',
  person2: 'Heng Kimmey',
  shortName1: 'Veha',
  shortName2: 'Kimmey',
  initials: 'V & K',

  // Cambodia time (UTC+7). Example only, not a verified event date.
  weddingDate: '2026-12-19T16:00:00+07:00',
  weddingDayLabel: 'Saturday, 19 December 2026',
  ceremonyTime: '4:00 PM',
  receptionTime: '6:00 PM',
  venueName: "The bride's residence",
  venueNameKm: 'គេហដ្ធានខាងស្រី',
  venueAddress: 'Phnom Penh, Cambodia',
  venueAddressKm: 'ភ្នំពេញ ប្រទេសកម្ពុជា',
  mapsLink: 'https://maps.app.goo.gl/9YzSJwWCkTQesEZK6',
  mapEmbedUrl: 'https://maps.google.com/maps?q=11.54340545259055,104.819085782388&z=15&output=embed',
  dressCode: 'Garden formal',

  // Replace with images of the real couple. Keep local paths rooted at /assets/.
  // Stock photos need internet access.
  photos: [
    `${window.WEDDING_ASSET_BASE}assets/images/RAK_7739.JPG`,
    `${window.WEDDING_ASSET_BASE}assets/images/RAK_8520.JPG`,
    `${window.WEDDING_ASSET_BASE}assets/images/RAK_7555.JPG`,
    `${window.WEDDING_ASSET_BASE}assets/images/RAK_7767.JPG`,
    `${window.WEDDING_ASSET_BASE}assets/images/RAK_7405.JPG`,
    `${window.WEDDING_ASSET_BASE}assets/images/RAK_8550.JPG`,
  ],

  // When hosted on Netlify, enable Forms in the Netlify dashboard.
  // Do not set this to true for other hosting providers.
  // Romantic solo piano from Pixabay: "Wedding" by The_Mountain
  // https://pixabay.com/music/solo-piano-wedding-455512/
  musicFile: `${window.WEDDING_ASSET_BASE}assets/audio/gentle-wedding-piano.mp3`
};
