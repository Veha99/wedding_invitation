(() => {
  'use strict';
  const cfg = window.WEDDING_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { if ($(id)) $(id).textContent = value; };
  const logo = document.querySelector('.brand img[data-site-asset]');
  if (logo) logo.src = `${window.WEDDING_ASSET_BASE || '/'}${logo.dataset.siteAsset}`;

  function updateGuestName() {
    const frame = $('guest-name-frame');
    const nameElement = $('guest-name');
    if (!frame || !nameElement) return;
    const path = window.location.pathname.replace(/\/+$/, '');
    const basePath = (window.WEDDING_ASSET_BASE || '/').replace(/\/+$/, '');
    const invitationPath = basePath && (path === basePath || path.startsWith(`${basePath}/`))
      ? path.slice(basePath.length)
      : path;
    const pathPart = invitationPath.split('/').filter(Boolean).pop() || '';
    const fragment = window.location.hash.slice(1);
    const legacyPrefix = 'home/';
    // Preferred format: /guest-name/#home (or #story, #timeline, etc.).
    // Keep supporting the older #home/guest-name format for existing links.
    let encodedName = pathPart && pathPart.toLowerCase() !== 'index.html' ? pathPart : '';
    if (!encodedName && fragment.startsWith(legacyPrefix)) {
      encodedName = fragment.slice(legacyPrefix.length).split('/')[0];
    }
    let name = encodedName;
    try { name = decodeURIComponent(encodedName); } catch (_) {}
    name = name.trim();
    nameElement.textContent = name;
  }

  updateGuestName();
  window.addEventListener('hashchange', updateGuestName);
  const short1 = cfg.shortName1 || cfg.person1 || 'Partner One';
  const short2 = cfg.shortName2 || cfg.person2 || 'Partner Two';
  const names = `${short1} & ${short2}`;
  const wedding = new Date(cfg.weddingDate || '2027-02-20T16:00:00+07:00');
  const longDay = cfg.weddingDayLabel || new Intl.DateTimeFormat('en-GB', {weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Phnom_Penh'}).format(wedding);
  let currentLanguage = 'en';

  function toKhmerDigits(value) {
    return String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]);
  }

  function localizedWeddingDay(language=currentLanguage) {
    if (language === 'km') {
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
        weekday:'long',day:'numeric',month:'numeric',year:'numeric',timeZone:'Asia/Phnom_Penh'
      }).formatToParts(wedding).map(({type,value}) => [type,value]));
      const weekdays = {Sunday:'អាទិត្យ',Monday:'ចន្ទ',Tuesday:'អង្គារ',Wednesday:'ពុធ',Thursday:'ព្រហស្បតិ៍',Friday:'សុក្រ',Saturday:'សៅរ៍'};
      const months = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
      return `ថ្ងៃ${weekdays[parts.weekday]} ទី${toKhmerDigits(parts.day)} ខែ${months[Number(parts.month)-1]} ឆ្នាំ${toKhmerDigits(parts.year)}`;
    }
    return longDay;
  }

  function localizedCeremonyTime(time, language=currentLanguage) {
    if (language !== 'km') return time;
    const match = String(time).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!match) return time;
    const period = match[3] ? ` ${match[3].toUpperCase() === 'PM' ? 'ល្ងាច' : 'ព្រឹក'}` : '';
    return `${toKhmerDigits(match[1].padStart(2,'0'))}:${toKhmerDigits(match[2])}${period}`;
  }

  function hasCustomVenueName(name) {
    return Boolean(name && !['your wedding venue', "the bride's residence"].includes(name.trim().toLowerCase()));
  }

  function applyLanguage(language) {
    currentLanguage = language === 'km' ? 'km' : 'en';
    const isKhmer = currentLanguage === 'km';
    document.documentElement.lang = currentLanguage;
    (window.WEDDING_TRANSLATIONS || []).forEach(([selector, english, khmer]) => {
      document.querySelectorAll(selector).forEach((element) => { element.innerHTML = isKhmer ? khmer : english; });
    });
    const ui = (window.WEDDING_UI_TEXT || {})[currentLanguage] || {};
    document.title = `${names} — ${ui.title || 'Wedding Invitation'}`;
    document.querySelector('meta[name="description"]').content = isKhmer
      ? `សូមអញ្ជើញចូលរួមអបអរសាទរពិធីមង្គលការរបស់ ${cfg.person1 || short1} និង ${cfg.person2 || short2}។`
      : `You are invited to celebrate the wedding of ${cfg.person1 || short1} and ${cfg.person2 || short2}.`;
    const venueNameIsCustom = hasCustomVenueName(cfg.venueName);
    const venueLabel = isKhmer
      ? (cfg.venueNameKm || (venueNameIsCustom ? cfg.venueName : 'គេហដ្ធានខាងស្រី'))
      : (cfg.venueName || "The bride's residence");
    const venueAddress = isKhmer
      ? (cfg.venueAddressKm || (cfg.venueAddress?.toLowerCase() === 'phnom penh, cambodia' ? 'ភ្នំពេញ ប្រទេសកម្ពុជា' : cfg.venueAddress || 'សូមបញ្ចូលអាសយដ្ឋាន'))
      : (cfg.venueAddress || 'Add an address');
    ['ceremony-venue','reception-venue','venue-name'].forEach((id) => setText(id, venueLabel));
    if ($('venue-map')) $('venue-map').title = isKhmer ? 'ផែនទីបង្ហាញទីតាំងពិធីមង្គលការ' : 'Map showing the wedding venue';
    document.querySelectorAll('.language-toggle').forEach((toggle) => {
      toggle.textContent = isKhmer ? 'English' : 'ខ្មែរ';
      toggle.setAttribute('aria-label', isKhmer ? 'ប្តូរភាសាទៅជាភាសាអង់គ្លេស' : 'Switch language to Khmer');
    });
    const aria = isKhmer ? {
      intro:'បើកលិខិតអញ្ជើញចូលរួមពិធីមង្គលការ', nav:'ម៉ឺនុយមេ', countdown:'រាប់ថយក្រោយដល់ថ្ងៃមង្គលការ',
      hero:'រូបថតគូស្វាមីភរិយាគំរូ សូមជំនួសដោយរូបថតផ្ទាល់ខ្លួន', story:'រូបថតគូស្វាមីភរិយាកំពុងដើរជាមួយគ្នា',
      detail:'រូបថតលម្អិតនៃពិធីមង្គលការ', gallery:'បើកមើលរូបថតទី', musicOn:'ផ្អាកតន្ត្រីផ្ទៃខាងក្រោយ',
      musicOff:'ចាក់តន្ត្រីផ្ទៃខាងក្រោយ', lightbox:'កម្មវិធីមើលរូបថត', close:'បិទកម្មវិធីមើលរូបថត',
      prev:'រូបថតមុន', next:'រូបថតបន្ទាប់', enlarged:'រូបថតពិធីមង្គលការដែលពង្រីក'
    } : {
      intro:'Open wedding invitation', nav:'Main navigation', countdown:'Countdown to our wedding',
      hero:'Sample wedding portrait; replace with your own photo', story:'Wedding couple walking together — sample gallery photo',
      detail:'Wedding detail — sample gallery photo', gallery:'Open gallery photo', musicOn:'Pause background music',
      musicOff:'Play background music', lightbox:'Photo viewer', close:'Close photo viewer',
      prev:'Previous photo', next:'Next photo', enlarged:'Enlarged wedding gallery sample'
    };
    $('intro').setAttribute('aria-label', aria.intro);
    document.querySelector('.navigation').setAttribute('aria-label', aria.nav);
    document.querySelector('.countdown').setAttribute('aria-label', aria.countdown);
    $('hero-photo').alt = aria.hero;
    $('story-photo').alt = aria.story;
    $('story-mini-photo').alt = aria.detail;
    document.querySelectorAll('.gallery__item').forEach((item, index) => {
      item.setAttribute('aria-label', `${aria.gallery} ${isKhmer ? new Intl.NumberFormat('km-KH').format(index+1) : index+1}`);
      item.querySelector('img').alt = isKhmer ? `រូបថតគំរូទី ${new Intl.NumberFormat('km-KH').format(index+1)}` : `Wedding gallery sample ${index+1}`;
    });
    $('lightbox').setAttribute('aria-label', aria.lightbox);
    $('lightbox-close').setAttribute('aria-label', aria.close);
    $('lightbox-prev').setAttribute('aria-label', aria.prev);
    $('lightbox-next').setAttribute('aria-label', aria.next);
    $('lightbox-image').alt = aria.enlarged;
    $('music-button').title = isKhmer ? 'បិទ/បើកតន្ត្រី' : 'Toggle music';
    $('music-button').setAttribute('aria-label', $('music-button').getAttribute('aria-pressed') === 'true' ? aria.musicOn : aria.musicOff);
    const dayLabel = localizedWeddingDay();
    const eventDate = $('invitation-date');
    if (eventDate){eventDate.textContent = dayLabel;eventDate.dateTime = wedding.toISOString().slice(0,10);}
    setText('invitation-time', localizedCeremonyTime(cfg.ceremonyTime || '4:00 PM'));
    setText('invitation-location', venueLabel);
    setText('invitation-address', venueAddress);
    setText('venue-address', venueAddress);
    setText('hero-date', isKhmer ? dayLabel : dayLabel.toUpperCase());
    setText('ceremony-date', dayLabel);
    setText('reception-date', dayLabel);
    if (typeof updateCountdown === 'function') updateCountdown();
  }

  document.title = `${names} — Wedding Invitation`;
  document.querySelector('meta[name="description"]').content = `You are invited to celebrate the wedding of ${cfg.person1 || short1} and ${cfg.person2 || short2}.`;
  setText('cover-initials', cfg.initials || '♡');
  setText('cover-names', names);
  setText('hero-name1', short1);
  setText('hero-name2', short2);
  setText('hero-date', longDay.toUpperCase());
  setText('story-signature', names);
  setText('footer-names', names);
  setText('ceremony-date', longDay);
  setText('reception-date', longDay);
  setText('ceremony-time', cfg.ceremonyTime || '4:00 PM');
  setText('reception-time', cfg.receptionTime || '6:00 PM');
  setText('ceremony-venue', cfg.venueName || 'Your Wedding Venue');
  setText('reception-venue', cfg.venueName || 'Your Wedding Venue');
  setText('venue-name', cfg.venueName || 'Your Wedding Venue');
  setText('venue-address', cfg.venueAddress || 'Add an address');
  setText('footer-year', String(wedding.getFullYear()));
  if ($('map-link')) $('map-link').href = cfg.mapsLink || '#details';
    const venueForMap = hasCustomVenueName(cfg.venueName) ? cfg.venueName : '';
    const mapQuery = [venueForMap, cfg.venueAddress].filter(Boolean).join(', ') || 'Phnom Penh, Cambodia';
    if ($('venue-map')) $('venue-map').src = cfg.mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  // If a photo cannot load (for example offline), a soft botanical-colored
  // background is displayed. Replace stock URL entries with your own files.
  const photos = Array.isArray(cfg.photos) ? cfg.photos : [];
  function putPhoto(img, src){
    if (!img) return;
    img.onerror = () => { img.classList.add('is-missing'); };
    img.onload = () => { img.classList.remove('is-missing'); };
    img.src = src || '';
  }
  putPhoto($('hero-photo'), photos[0]);
  putPhoto($('story-photo'), photos[1] || photos[0]);
  putPhoto($('story-mini-photo'), photos[3] || photos[0]);
  document.querySelectorAll('.gallery__item').forEach((item,index) => putPhoto(item.querySelector('img'), photos[index]));
  applyLanguage(currentLanguage);
  document.querySelectorAll('.language-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => applyLanguage(currentLanguage === 'en' ? 'km' : 'en'));
  });

  // Reveal animations respect reduced-motion settings.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    },{threshold:.11,rootMargin:'0px 0px -20px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
  }

  // Music starts after the user opens the envelope. Browsers block autoplay
  // before a user gesture, so this is intentional.
  const audio = $('background-music');
  audio.src = cfg.musicFile || `${window.WEDDING_ASSET_BASE || '/'}assets/audio/wedding-melody.wav`;
  audio.volume = 0.42;
  let musicPlaying = false;
  function reflectMusic(){
    $('music-button').classList.toggle('is-playing', musicPlaying);
    $('music-button').setAttribute('aria-pressed', String(musicPlaying));
    $('music-button').setAttribute('aria-label', currentLanguage === 'km'
      ? (musicPlaying ? 'ផ្អាកតន្ត្រីផ្ទៃខាងក្រោយ' : 'ចាក់តន្ត្រីផ្ទៃខាងក្រោយ')
      : (musicPlaying ? 'Pause background music' : 'Play background music'));
    $('music-icon').textContent = musicPlaying ? '♫' : '♪';
  }
  async function playMusic(){
    try { await audio.play(); musicPlaying = true; }
    catch(err){ musicPlaying = false; console.info('Music requires a user gesture:', err.message); }
    reflectMusic();
  }
  function pauseMusic(){audio.pause(); musicPlaying=false;reflectMusic();}
  $('music-button').addEventListener('click',()=>musicPlaying ? pauseMusic() : playMusic());
  const mobileNavQuery = window.matchMedia('(max-width: 760px)');
  let mobileNavHideTimer;
  let mobileNavAutoHideStarted = false;
  function scheduleMobileNavHide(){
    clearTimeout(mobileNavHideTimer);
    if (!mobileNavQuery.matches){document.body.classList.remove('mobile-nav-hidden');return;}
    document.body.classList.remove('mobile-nav-hidden');
    mobileNavHideTimer = window.setTimeout(()=>document.body.classList.add('mobile-nav-hidden'),1500);
  }
  function startMobileNavAutoHide(){
    if (mobileNavAutoHideStarted) return;
    mobileNavAutoHideStarted = true;
    scheduleMobileNavHide();
  }
  window.addEventListener('scroll',()=>{
    if (mobileNavAutoHideStarted && mobileNavQuery.matches) scheduleMobileNavHide();
  },{passive:true});
  window.addEventListener('resize',()=>{
    if (!mobileNavQuery.matches){clearTimeout(mobileNavHideTimer);document.body.classList.remove('mobile-nav-hidden');}
    else if (mobileNavAutoHideStarted) scheduleMobileNavHide();
  },{passive:true});
  const mobileNav = document.querySelector('.navigation');
  mobileNav?.addEventListener('focusin',()=>{
    clearTimeout(mobileNavHideTimer);
    document.body.classList.remove('mobile-nav-hidden');
  });
  mobileNav?.addEventListener('focusout',scheduleMobileNavHide);
  $('open-invitation').addEventListener('click',()=>{
    document.body.classList.remove('invitation-locked');
    $('site-shell').classList.add('is-visible');
    $('intro').classList.add('is-hidden');
    $('intro').setAttribute('aria-hidden','true');
    $('music-button').classList.add('is-shown');
    startMobileNavAutoHide();
    playMusic();
    setTimeout(()=>$('intro').remove(),1100);
  });

  // Countdown: correct on the user's local device regardless of time zone,
  // because cfg.weddingDate contains the +07:00 Cambodia UTC offset.
  function updateCountdown(){
    let seconds = Math.max(0, Math.floor((wedding.getTime()-Date.now())/1000));
    const days = Math.floor(seconds/86400);seconds%=86400;
    const hours=Math.floor(seconds/3600);seconds%=3600;
    const minutes=Math.floor(seconds/60);seconds%=60;
    const format = new Intl.NumberFormat(currentLanguage === 'km' ? 'km-KH' : 'en-GB', {minimumIntegerDigits:2,useGrouping:false});
    setText('count-days',format.format(days));
    setText('count-hours',format.format(hours));
    setText('count-minutes',format.format(minutes));
    setText('count-seconds',format.format(seconds));
  }
  updateCountdown();setInterval(updateCountdown,1000);

  // Gallery lightbox, keyboard accessible.
  let activePhoto=0;
  let lastFocused=null;
  const lightbox=$('lightbox');
  function showPhoto(index){
    activePhoto=(index+photos.length)%photos.length;
    putPhoto($('lightbox-image'),photos[activePhoto]);
    const photoNumber = new Intl.NumberFormat(currentLanguage === 'km' ? 'km-KH' : 'en-GB').format(activePhoto+1);
    const totalPhotos = new Intl.NumberFormat(currentLanguage === 'km' ? 'km-KH' : 'en-GB').format(photos.length);
    setText('lightbox-counter',`${photoNumber} / ${totalPhotos}`);
  }
  function openPhoto(index){
    if(!photos.length)return;
    lastFocused=document.activeElement;
    showPhoto(index);
    lightbox.classList.add('is-open');lightbox.setAttribute('aria-hidden','false');
    $('lightbox-close').focus();
  }
  function closePhoto(){lightbox.classList.remove('is-open');lightbox.setAttribute('aria-hidden','true');lastFocused?.focus();}
  document.querySelectorAll('.gallery__item').forEach(el=>el.addEventListener('click',()=>openPhoto(Number(el.dataset.index))));
  $('lightbox-close').addEventListener('click',closePhoto);
  $('lightbox-prev').addEventListener('click',()=>showPhoto(activePhoto-1));
  $('lightbox-next').addEventListener('click',()=>showPhoto(activePhoto+1));
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)closePhoto();});
  document.addEventListener('keydown',event=>{
    if(!lightbox.classList.contains('is-open'))return;
    if(event.key==='Escape')closePhoto();
    if(event.key==='ArrowLeft')showPhoto(activePhoto-1);
    if(event.key==='ArrowRight')showPhoto(activePhoto+1);
  });

  // Native share sheet where available, otherwise copy URL.
  $('share-link').addEventListener('click',async()=>{
    const url=location.href.split('#')[0];
    try{
      if(navigator.share){
        const text=currentLanguage === 'km' ? 'សូមអញ្ជើញចូលរួមអបអរសាទរជាមួយ ' + names + '!' : 'You are invited to celebrate with ' + names + '!';
        await navigator.share({title:document.title,text,url});return;
      }
      await navigator.clipboard.writeText(url);
      $('share-link').textContent=currentLanguage === 'km' ? 'បានចម្លងតំណ ✓' : 'Link copied ✓';
      setTimeout(()=>{$('share-link').innerHTML=currentLanguage === 'km' ? 'ចែករំលែកលិខិតអញ្ជើញ ↗' : 'Share invitation ↗';},2500);
    }catch(e){if(e.name!=='AbortError')window.prompt(currentLanguage === 'km' ? 'ចម្លងតំណលិខិតអញ្ជើញ៖' : 'Copy invitation link:',url);}
  });
})();
