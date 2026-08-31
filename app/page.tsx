export default function Page() {
  return (
    <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
<div class="grain"></div>
<div class="focus-pull"></div>

<div class="lens lens-t"></div><div class="lens lens-b"></div>
<span class="corner co-tl"></span><span class="corner co-tr"></span>
<span class="corner co-bl"></span><span class="corner co-br"></span>
<span class="vf-tick t"></span><span class="vf-tick b"></span>
<div class="hud hud-tl"><span class="rec"></span><span id="rec-label"><b>REC</b><span class="hud-sub"> — Ghost Cam · A-Roll</span></span></div>
<div class="hud hud-tr">
  <span class="fmt">2.39:1 · Vision3 · 24 fps</span>
  <button id="menu-btn">Scenes</button>
</div>

<!-- timeline nav -->
<nav id="tl" aria-label="Timeline">
  <div class="tl-tc" id="tc">TC 00:00:00:00</div>
  <div class="tl-mid">
    <div class="tl-segs" id="tl-segs"></div>
    <div class="playhead" id="playhead"></div>
  </div>
  <div class="tl-sc"><span class="no" id="sc-no">SC 00 / 08</span><span class="nm" id="sc-name">Opening titles</span></div>
</nav>

<!-- leader -->
<div class="bar top"></div><div class="bar bot"></div>
<div id="leader">
  <div class="leader-x h"></div><div class="leader-x v"></div>
  <div class="leader-ring">
    <div class="leader-sweep" id="sweep"></div>
    <div id="leader-num" class="serif">3</div>
  </div>
  <div class="leader-cap">Bumim — Picture Start</div>
</div>

<!-- menu -->
<div id="menu">
  <button class="m-close" id="menu-close">Close ✕</button>
  <a href="#hero"><span class="m-sc">SC 00</span><span class="m-t">Opening titles</span></a>
  <a href="#manifesto"><span class="m-sc">SC 01</span><span class="m-t">The unseen author</span></a>
  <a href="#strip"><span class="m-sc">SC 02</span><span class="m-t">Selected treatments</span></a>
  <a href="#real"><span class="m-sc">SC 03</span><span class="m-t">Pitches that became campaigns</span></a>
  <a href="#ai"><span class="m-sc">SC 04</span><span class="m-t">AI in the pipeline</span></a>
  <a href="#appar"><span class="m-sc">SC 05</span><span class="m-t">Apparitions</span></a>
  <a href="#credits"><span class="m-sc">SC 06</span><span class="m-t">Credits</span></a>
  <a href="#end"><span class="m-sc">SC 07</span><span class="m-t">Got a brief?</span></a>
</div>

<!-- ============ SC 00 — HERO ============ -->
<section id="hero" data-sc="00" data-name="Opening titles">
  <div class="kicker reveal">
    <div class="lockup">
      <img class="lockup-mark" src="/assets/bumim-mark.png" alt="Bumim">
      <span class="lockup-word" dir="rtl" lang="fa">بومیم</span>
    </div>
    <div class="studio-line">
      <span class="studio-for">Design studio for</span>
      <span class="studio-rot" id="studio-rot">
        <span>Treatment design — commercials, music videos, brand films, movies &amp; shows</span>
        <span>Mood research</span>
        <span>AI film &amp; images for pitches and final release</span>
        <span>Key visual &amp; design work for all media</span>
      </span>
    </div>
  </div>
  <h1>
    <div class="reveal split re"><span class="gh" data-text="You've seen us.">You've seen us.</span></div>
    <div class="l2 reveal split re"><span class="gh" data-text="You just don't know it.">You just <em>don't know it.</em></span></div>
  </h1>
  <div class="h-foot">
    <p class="h-sub reveal">Director treatments, pitch decks, mood research and AI concept frames.
      For the directors you know — from the ghost you don't.</p>
    <div class="h-scroll reveal"><span class="ln"></span> Roll picture — scroll</div>
  </div>
</section>

<!-- ============ SC 01 — MANIFESTO ============ -->
<header class="slate reveal re"><span class="sc">SC 01</span><span class="nm">The unseen author</span><span class="tk">Take 01 · MOS</span></header>
<section id="manifesto" data-sc="01" data-name="The unseen author">
  <div class="m-in">
    <h2 class="reveal split re">You've seen our work on air.<br>
      You've never <em>seen us.</em></h2>
    <p class="reveal re">Musicians, authors and screenwriters have ghostwriters. Agencies, production
      companies, producers and directors book us as their Bumim. Bumim is the invisible
      half of the pitch. We design the treatments and decks directors walk into the room with —
      delivered for <b>Mercedes-Benz, BMW, Ford, Audi, VW, Sony, Samsung, Nivea, Pepsi and
      Nutella</b>, with production houses across Europe, the US and beyond.
      The work gets famous. We stay the ghost.</p>
  </div>
  <p class="eyebrow reveal re" style="margin-top:9vh">What we make</p>
  <div class="svc-grid" id="services">
    <div class="svc reveal"><span class="s-i">i.</span><h3>Treatment design</h3>
      <p>End-to-end visual treatments. Editorial layout, image research, concept frames, storyboard integration.</p></div>
    <div class="svc reveal"><span class="s-i">ii.</span><h3>Pitch decks</h3>
      <p>Production-house-grade pitch documents. Cinematic, tightly art-directed, without a wasted page.</p></div>
    <div class="svc reveal"><span class="s-i">iii.</span><h3>Mood &amp; reference</h3>
      <p>Deep reference research and mood curation. The director's visual language — refined, never stock.</p></div>
    <div class="svc reveal"><span class="s-i">iv.</span><h3>AI film &amp; image</h3>
      <p>Moving concept frames, cinematic stills and full spots — art directed, then generated.</p></div>
    <div class="svc reveal"><span class="s-i">v.</span><h3>Titles &amp; key art</h3>
      <p>Main title sequences, key visuals, posters and logos for series and features. Credited work.</p></div>
  </div>
</section>

<!-- ============ SC 02 — TREATMENTS ============ -->
<section id="strip" data-sc="02" data-name="Selected treatments">
  <div class="pin">
    <header class="slate reveal re" style="margin-bottom:5vh"><span class="sc">SC 02</span><span class="nm">Selected treatments</span><span class="tk">Take 01 · 05 boards</span></header>
    <div class="track" id="track">
      <div class="fcard">
        <span class="f-no">№ 01</span>
        <div class="f-media"><div class="inner"><video class="ph-fill" autoplay muted loop playsinline preload="metadata" src="/assets/treatment-01-american-tourister.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"></video></div></div>
      </div>
      <div class="fcard">
        <span class="f-no">№ 02</span>
        <div class="f-media"><div class="inner"><video class="ph-fill" autoplay muted loop playsinline preload="metadata" src="/assets/treatment-02-mcdonalds.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"></video></div></div>
      </div>
      <div class="fcard">
        <span class="f-no">№ 03</span>
        <div class="f-media"><div class="inner"><video class="ph-fill" autoplay muted loop playsinline preload="metadata" src="/assets/treatment-03-jaegermeister.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"></video></div></div>
      </div>
      <div class="fcard">
        <span class="f-no">№ 04</span>
        <div class="f-media"><div class="inner"><video class="ph-fill" autoplay muted loop playsinline preload="metadata" src="/assets/treatment-04-welcome-back.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"></video></div></div>
      </div>
      <div class="fcard">
        <span class="f-no">№ 05</span>
        <div class="f-media"><div class="inner"><video class="ph-fill" autoplay muted loop playsinline preload="metadata" src="/assets/treatment-05-tokiovada.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"></video></div></div>
      </div>
      <div class="strip-end"><div class="se">Every board is a promise<br>the film <em>keeps.</em></div></div>
    </div>
    <div class="strip-prog"><i id="strip-i"></i></div>
  </div>
</section>

<!-- ============ SC 03 — REALISED ============ -->
<header class="slate reveal re"><span class="sc">SC 03</span><span class="nm">Pitches that became campaigns</span><span class="tk">Take 01 · Sync sound</span></header>
<section id="real" data-sc="03" data-name="Realised">
  <div class="real-grid reveal">
    <a class="rw-card" href="https://vimeo.com/714045362" target="_blank" rel="noopener noreferrer">
      <span class="rw-still"><img src="/assets/still-01.jpg" alt="Mercedes-Benz × Alicia Keys — brand film" loading="lazy"><span class="rw-play"></span></span>
      <span class="rw-meta">
        <span class="rw-no">001 — Brand film</span>
        <span class="rw-t">Mercedes-Benz × Alicia Keys</span>
      </span>
    </a>
    <a class="rw-card" href="https://www.youtube.com/watch?v=-BS9PJhMq6E" target="_blank" rel="noopener noreferrer">
      <span class="rw-still"><img src="/assets/still-02.jpg" alt="#believeinchristmas — Erste Group" loading="lazy"><span class="rw-play"></span></span>
      <span class="rw-meta">
        <span class="rw-no">002 — Erste Group</span>
        <span class="rw-t">#believeinchristmas</span>
        <span class="laur">Series honoured with 28+ industry awards</span>
      </span>
    </a>
    <a class="rw-card" href="https://www.youtube.com/watch?v=KP6ig7DUN90" target="_blank" rel="noopener noreferrer">
      <span class="rw-still"><img src="/assets/still-03.jpg" alt="X-Class Follow — Mercedes-Benz" loading="lazy"><span class="rw-play"></span></span>
      <span class="rw-meta">
        <span class="rw-no">003 — Mercedes-Benz</span>
        <span class="rw-t">X-Class — Follow</span>
        <span class="laur">Red Dot Award — Brands &amp; Communication</span>
      </span>
    </a>
    <a class="rw-card" href="https://www.youtube.com/watch?v=tShKow0SbDs" target="_blank" rel="noopener noreferrer">
      <span class="rw-still"><img src="/assets/still-04.jpg" alt="Erleichterung — FRIDAY" loading="lazy"><span class="rw-play"></span></span>
      <span class="rw-meta">
        <span class="rw-no">004 — FRIDAY</span>
        <span class="rw-t">Erleichterung</span>
      </span>
    </a>
    <a class="rw-card" href="https://www.youtube.com/watch?v=Gyw3W91195E" target="_blank" rel="noopener noreferrer">
      <span class="rw-still"><img src="/assets/still-05.jpg" alt="Leben für Fortgeschrittene — Ford Fiesta" loading="lazy"><span class="rw-play"></span></span>
      <span class="rw-meta">
        <span class="rw-no">005 — Ford Fiesta</span>
        <span class="rw-t">Leben für Fortgeschrittene</span>
      </span>
    </a>
    <a class="rw-card" href="https://www.youtube.com/watch?v=iRf-tM8Qy2U" target="_blank" rel="noopener noreferrer">
      <span class="rw-still"><img src="/assets/still-06.jpg" alt="G-Wagon — Mercedes-Benz" loading="lazy"><span class="rw-play"></span></span>
      <span class="rw-meta">
        <span class="rw-no">006 — Mercedes-Benz</span>
        <span class="rw-t">G-Wagon</span>
        <span class="laur">Cannes Lions Silver · Eurobest Grand Prix · ADC Gold · Effie Silver — 4th most-awarded campaign of its year</span>
      </span>
    </a>
  </div>
</section>

<!-- ============ SC 04 — AI ============ -->
<header class="slate reveal re"><span class="sc">SC 04</span><span class="nm">AI in the pipeline</span><span class="tk">Take 02 · VFX</span></header>
<section id="ai" data-sc="04" data-name="AI in the pipeline">
  <div class="ai-state">
    <h2 class="reveal split re">Art directed,<br>then <em>generated.</em></h2>
    <p class="reveal re">AI isn't the pitch. It's the draftsman. Every frame is curated and shaped to the
      director's intent — lensing, light, grade and casting locked in a prompt bible before a single
      pixel is generated.</p>
  </div>
  <div class="collage">
    <div class="cg-col c1">
      <div class="cg reveal" style="--r:1280/720"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-07.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:1280/720"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-10.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:1280/548"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-04.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:1280/598"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-03.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
    </div>
    <div class="cg-col c2">
      <div class="cg reveal" style="--r:640/360"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-01.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:1280/720"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-09.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:640/360"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-11.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:640/360"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-08.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:400/532"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-05.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
    </div>
    <div class="cg-col c3">
      <div class="cg reveal" style="--r:800/1422"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-02.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
      <div class="cg reveal" style="--r:400/710"><video autoplay muted loop playsinline preload="metadata" src="/assets/ai-06.webm" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></div>
    </div>
  </div>
  <div class="w-marquee" id="mq-tools"><div class="mq-in">
    <span>Nano Banana Pro — Seedance — Kling — Midjourney — Runway — Luma — Cinema Studio 4K — and many more — </span>
  </div></div>
</section>

<!-- ============ SC 05 — APPARITIONS ============ -->
<header class="slate reveal re"><span class="sc">SC 05</span><span class="nm">Apparitions</span><span class="tk">Take 01 · Credited</span></header>
<section id="appar" data-sc="05" data-name="Apparitions">
  <div class="ap-head">
    <h2 class="reveal split re">Except when <em>you have.</em></h2>
    <p class="reveal re">Sometimes the ghost steps into frame. Title sequences, key art, posters and logos
      for series and features — released, and for once, credited.</p>
  </div>

  <div class="ap-stage reveal">
    <div class="ap-rail" id="ap-rail">
      <div class="ap-card wide">
        <div class="ph-fill pal-am"></div>
        <div class="nda">
          <span class="nda-stamp">Under NDA — signed</span>
          <span class="nda-t">Main title sequence</span>
          <span class="nda-s">To be released — the reveal follows the premiere</span>
        </div>
      </div>
      <div class="ap-card tall">
        <div class="ph-fill pal-sv"></div>
        <div class="nda">
          <span class="nda-stamp">Under NDA — signed</span>
          <span class="nda-t">Key visual 01</span>
          <span class="nda-s">To be released</span>
        </div>
      </div>
      <div class="ap-card tall">
        <div class="ph-fill pal-am"></div>
        <div class="nda">
          <span class="nda-stamp">Under NDA — signed</span>
          <span class="nda-t">Key visual 02</span>
          <span class="nda-s">To be released</span>
        </div>
      </div>
      <div class="ap-card tall">
        <div class="ph-fill pal-fr"></div>
        <div class="nda">
          <span class="nda-stamp">Under NDA — signed</span>
          <span class="nda-t">Key visual 03</span>
          <span class="nda-s">To be released</span>
        </div>
      </div>
    </div>
    <div class="ap-railhint"><span class="tri"></span>Hover &amp; scroll the reel — 04 apparitions under wraps</div>
  </div>

  <p class="ap-note reveal re">Main titles · key art · posters · logos — <b>in frame, as credited</b></p>
</section>

<!-- ============ SC 06 — CREDITS ============ -->
<header class="slate reveal re"><span class="sc">SC 06</span><span class="nm">Credits</span><span class="tk">Roll · End titles</span></header>
<section id="credits" data-sc="06" data-name="Credits">
  <p class="eyebrow cr-cap reveal re">In order of appearance</p>
  <div class="brands reveal">
    <div class="brand"><img src="/assets/logo-mercedes.svg" alt="Mercedes-Benz" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-ford.svg" alt="Ford" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-audi.svg" alt="Audi" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-vw.svg" alt="VW" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-sony.svg" alt="Sony" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-samsung.svg" alt="Samsung" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-nivea.svg" alt="Nivea" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-pepsi.svg" alt="Pepsi" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-nutella.svg" alt="Nutella" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-audible.svg" alt="Audible" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-braun.svg" alt="Braun" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-burgerking.svg" alt="Burger King" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-citroen.svg" alt="Citroën" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-commerzbank.svg" alt="Commerzbank" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-db.svg" alt="Deutsche Bahn" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-jaegermeister.svg" alt="Jägermeister" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-jever.svg" alt="Jever" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-kinder.svg" alt="Kinder" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-man.svg" alt="MAN" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-mcdonalds.svg" alt="McDonald's" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-mini.svg" alt="MINI" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-opel.svg" alt="Opel" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-peloton.svg" alt="Peloton" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-saturn.svg" alt="Saturn" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-schwarzkopf.svg" alt="Schwarzkopf" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-siemens.svg" alt="Siemens" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-sixt.svg" alt="Sixt" loading="lazy"></div>
    <div class="brand"><img src="/assets/logo-zdf.svg" alt="ZDF" loading="lazy"></div>
  </div>
  <div class="cr-roll reveal" style="margin-top:7vh">
    <div class="cr"><span class="role">As the ghost — uncredited</span><span class="who">Pitch decks for ads, movies &amp; shows</span></div>
    <div class="cr"><span class="role">In frame — credited</span><span class="who">Title design &amp; key art — series &amp; feature films</span></div>
    <div class="cr"><span class="role">With production houses</span><span class="who">Worked with over 150 production houses</span></div>
    <div class="cr"><span class="role">Territory</span><span class="who">Germany &amp; Worldwide</span></div>
  </div>
</section>

<!-- ============ SC 07 — END ============ -->
<section id="end" data-sc="07" data-name="Got a brief?">
  <div class="cut reveal split re"><span class="gh" data-text="Cut.">Cut.</span></div>
  <div class="end-slate reveal">
    <div class="es-stripe"></div>
    <div class="es-row"><span>Scene</span><span>Your brief</span></div>
    <div class="es-row"><span>Director</span><span>You</span></div>
    <div class="es-row"><span>Studio</span><span>Bumim®</span></div>
    <div class="es-row"><span>Take</span><span>01</span></div>
  </div>
  
</section>
<!-- ============ LEGAL ============ -->
<section id="legal">
  <p class="eyebrow lg-cap reveal">Fine print — Legal &amp; privacy</p>
  <div class="legal-grid reveal">
    <div class="lg">
      <h4>Imprint</h4>
      <p>Bumim® is a treatment &amp; AI studio for commercials, music videos, movies and shows.</p>
    </div>
    <div class="lg">
      <h4>Copyright</h4>
      <p>© 2026 Bumim®. All rights reserved. All treatments, pitch decks, concept frames,
      title designs, key art and other materials shown on this site are the intellectual property
      of Bumim and/or the respective clients and rights holders. Reproduction, distribution
      or any public use — in whole or in part — without prior written consent is prohibited.</p>
    </div>
    <div class="lg">
      <h4>Shown work &amp; trademarks</h4>
      <p>All brand names and logos appear exclusively as references to commissioned work and remain
      trademarks of their respective owners. Work created under non-disclosure agreements is shown
      in approved or redacted form only. External links (Vimeo, YouTube) open on their platforms and
      are subject to those platforms' terms.</p>
    </div>
    <div class="lg">
      <h4>Privacy</h4>
      <p>This site sets no cookies and embeds no third-party content. All assets — including fonts
      and video — are served from this domain. For visitor statistics we use Vercel Web Analytics,
      which is cookieless: it records page views and aggregated technical data (such as referrer,
      country, browser and device type) without storing identifiers on your device and without
      building visitor profiles. No data is sold or passed to advertisers. If you contact us by
      e-mail or phone, your details are used solely to answer your enquiry and are never shared.
      You may request deletion of your correspondence at any time.</p>
    </div>
  </div>
</section>
<footer><span>© Bumim® 2026 — All rights reserved</span><span>Prototype IV — The Ghost Cam</span></footer>

<!-- Vercel Web Analytics — cookieless page views. The script is served by
     Vercel itself at /_vercel/insights/script.js, so no third-party host. -->
<script>window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };</script>
<script defer src="/_vercel/insights/script.js"></script>

<script>
/* =========================================================
   BUMIM — Prototype IV
   New: NLE timeline nav (segments = scenes, playhead =
   scroll), 16:9 treatment cards, verified award laurels,
   11-GIF collage, velocity-reactive marquee, brand grid,
   SC 04 "Apparitions" with letterboxed title-sequence
   stage that flips the HUD from REC to PLAY.
   ========================================================= */
const fine = matchMedia('(pointer:fine)').matches;
const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
if (fine) document.body.classList.add('fine');

let W = innerWidth, H = innerHeight;

/* ---------- leader ---------- */
const leader = document.getElementById('leader');
const numEl = document.getElementById('leader-num');
const sweep = document.getElementById('sweep');
let leadStart = null, leadDone = false;
function runLeader(ts){
  if (!leadStart) leadStart = ts;
  const el = ts - leadStart, per = 560;
  const n = 3 - Math.floor(el/per);
  const frac = (el%per)/per;
  sweep.style.background = \`conic-gradient(rgba(240,168,0,.16) \${frac*360}deg, transparent \${frac*360}deg)\`;
  if (n >= 1){
    if (numEl.textContent !== String(n)){
      numEl.textContent = n;
      leader.classList.remove('flick'); void leader.offsetWidth;
      leader.classList.add('flick');
    }
    requestAnimationFrame(runLeader);
  } else if (!leadDone){
    leadDone = true;
    leader.classList.add('gone');
    document.body.classList.remove('locked');
    document.body.classList.add('rolling');
    setTimeout(()=>{ initReveals(); layoutTimeline(); }, 200);
  }
}

/* ---------- reveals ---------- */
function splitWords(el){
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const walk = node => {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType===3){
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(tok => {
          if (/^\s*$/.test(tok)){ frag.appendChild(document.createTextNode(tok)); return; }
          const s = document.createElement('span');
          s.className='rv'; s.textContent = tok;
          frag.appendChild(s);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType===1 && ch.tagName!=='BR' && !ch.classList.contains('gh')) walk(ch);
    });
  };
  walk(el);
  el.querySelectorAll('.rv').forEach((s,i)=> s.style.transitionDelay = (i*80)+'ms');
}
function initReveals(){
  document.querySelectorAll('.reveal.split').forEach(el => {
    if (!el.querySelector('.gh')) splitWords(el);
  });
  const obs = new IntersectionObserver(ents => {
    ents.forEach(en => {
      if (en.target.classList.contains('re')){
        /* chapter texts ghost in again on EVERY arrival */
        en.target.classList.toggle('in', en.isIntersecting);
      } else if (en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ---------- timeline nav ---------- */
const scenes = [...document.querySelectorAll('[data-sc]')];
const segsWrap = document.getElementById('tl-segs');
const playhead = document.getElementById('playhead');
const tcEl = document.getElementById('tc');
const scNo = document.getElementById('sc-no');
const scName = document.getElementById('sc-name');
const TOTAL = scenes.length - 1;
scenes.forEach(sec => {
  const b = document.createElement('button');
  b.className = 'seg';
  b.innerHTML = \`<span class="sg-no">\${sec.dataset.sc}</span>
    <span class="sg-tip">SC \${sec.dataset.sc} — \${sec.dataset.name}</span>\`;
  b.addEventListener('click', () => sec.scrollIntoView({behavior: reduced?'auto':'smooth'}));
  segsWrap.appendChild(b);
});
const segs = [...segsWrap.children];
function layoutTimeline(){
  const docH = document.documentElement.scrollHeight;
  scenes.forEach((sec,i) => {
    const next = scenes[i+1];
    const h = (next ? next.offsetTop : docH) - sec.offsetTop;
    segs[i].style.flexGrow = Math.max(h, 1);
    segs[i].style.flexBasis = '0';
  });
}
function pad(n){ return String(n).padStart(2,'0'); }
function updateHUD(){
  const max = document.documentElement.scrollHeight - H;
  const prog = scrollY/Math.max(1,max);
  const frames = Math.round(prog * 24*90);
  const f = frames%24, s = Math.floor(frames/24)%60, m = Math.floor(frames/1440);
  /* phones: the full "TC 00:00:00:00" ate nearly half the bar and squeezed
     the scene segments — show the short reel timecode there instead */
  tcEl.textContent = innerWidth <= 600
    ? \`\${pad(m)}:\${pad(s)}:\${pad(f)}\`
    : \`TC 00:\${pad(m)}:\${pad(s)}:\${pad(f)}\`;
  playhead.style.left = (prog*100)+'%';
  let cur = 0;
  scenes.forEach((sec,i) => {
    if (sec.getBoundingClientRect().top <= H*.5) cur = i;
  });
  scNo.textContent = \`SC \${scenes[cur].dataset.sc} / \${pad(TOTAL)}\`;
  scName.textContent = scenes[cur].dataset.name;
  segs.forEach((sg,i)=>sg.classList.toggle('on', i===cur));
}

/* ---------- filmstrip ---------- */
const strip = document.getElementById('strip');
const track = document.getElementById('track');
const stripI = document.getElementById('strip-i');
let txCur = 0;
function updateStrip(){
  if (innerWidth <= 900) return;
  const top = strip.offsetTop;
  const range = strip.offsetHeight - H;
  const prog = Math.min(1, Math.max(0, (scrollY-top)/range));
  const maxX = track.scrollWidth - innerWidth + innerWidth*.06;
  const target = -prog*Math.max(0,maxX);
  txCur += (target-txCur)*(reduced?1:.09);
  track.style.transform = \`translate3d(\${txCur}px,0,0)\`;
  stripI.style.width = (prog*100)+'%';
}

/* ---------- apparitions: HUD flips REC -> PLAY ---------- */
const apStage = document.querySelector('.ap-stage');
const recLabel = document.getElementById('rec-label');
new IntersectionObserver(ents => {
  ents.forEach(en => {
    document.body.classList.toggle('playing', en.isIntersecting);
    recLabel.innerHTML = en.isIntersecting
      ? '<b>PLAY</b><span class="hud-sub"> — Apparition · Credited</span>'
      : '<b>REC</b><span class="hud-sub"> — Ghost Cam · A-Roll</span>';
  });
}, {threshold:.35}).observe(apStage);

/* ---------- velocity-reactive marquee ---------- */
function makeMarquee(wrap){
  const inner = wrap.querySelector('.mq-in');
  const unitHTML = inner.innerHTML;
  let unitW = 0, x = 0, v = 0;
  function build(){
    inner.innerHTML = unitHTML;
    unitW = inner.getBoundingClientRect().width;
    if (unitW < 10) return;
    const copies = Math.ceil((innerWidth + unitW)/unitW) + 1;
    for (let i=1;i<copies;i++) inner.innerHTML += unitHTML;
  }
  build();
  let lastY = scrollY;
  return function step(){
    if (unitW < 10){ build(); return; }
    const vel = scrollY - lastY; lastY = scrollY;
    /* always drift so the loop runs on its own; scrolling just speeds it up */
    const target = 1.2 + (reduced ? 0 : vel*.55);
    v += (target - v)*.08;
    x -= v;
    if (x <= -unitW) x += unitW;
    if (x > 0) x -= unitW;
    inner.style.transform = \`translate3d(\${x}px,0,0)\`;
  };
}
let mqStep = ()=>{};

/* ---------- menu ---------- */
const menu = document.getElementById('menu');
document.getElementById('menu-btn').addEventListener('click', ()=>{
  menu.classList.add('open');
  [...menu.querySelectorAll('a')].forEach((a,i)=> a.style.transitionDelay = (60+i*40)+'ms');
});
document.getElementById('menu-close').addEventListener('click', ()=>menu.classList.remove('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  menu.classList.remove('open');
  const t = document.querySelector(a.getAttribute('href'));
  setTimeout(()=> t.scrollIntoView({behavior: reduced?'auto':'smooth'}), 200);
}));
addEventListener('keydown', e => { if (e.key==='Escape') menu.classList.remove('open'); });

/* ---------- boot & loop ---------- */
let started = false;
function boot(){
  if (started) return;
  started = true;
  mqStep = makeMarquee(document.getElementById('mq-tools'));
  requestAnimationFrame(runLeader);
}
if (document.fonts && document.fonts.ready){
  document.fonts.ready.then(boot); setTimeout(boot, 1800);
} else boot();

let rsT = null;
addEventListener('resize', () => {
  W = innerWidth; H = innerHeight;
  clearTimeout(rsT);
  rsT = setTimeout(()=>{ layoutTimeline(); mqStep = makeMarquee(document.getElementById('mq-tools')); }, 200);
});
function loop(t){
  if (!document.body.classList.contains('locked')){
    updateHUD(); updateStrip(); mqStep();
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script>
<script>
/* playback governor — only clips that are actually on screen decode.
   letting all 16 run at once exhausts memory on phones and kills the tab.
   the autoplay attribute is dropped so nothing starts before we say so. */
(() => {
  const vids = [...document.querySelectorAll('video')];
  const small = innerWidth <= 900;
  const MAX = small ? 4 : 16;               // hard cap on concurrent decoders
  const playing = new Set();

  vids.forEach(v => { v.removeAttribute('autoplay'); v.preload = 'metadata'; });

  const stop = v => { if (!v.paused) v.pause(); playing.delete(v); };
  const start = v => {
    if (v.dataset.vis !== '1' || playing.has(v)) return;
    if (playing.size >= MAX) {               // evict the one furthest off centre
      let worst = null, worstD = -1;
      playing.forEach(p => {
        if (p.dataset.vis === '1') {
          const r = p.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
          if (d > worstD) { worstD = d; worst = p; }
        } else { worst = p; worstD = Infinity; }
      });
      if (!worst) return;
      stop(worst);
    }
    playing.add(v);
    v.play().catch(() => playing.delete(v));
  };

  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    v.dataset.vis = e.isIntersecting ? '1' : '0';
    if (e.isIntersecting) start(v); else stop(v);
  }), {rootMargin: small ? '0px' : '200px 0px'});

  vids.forEach(v => {
    io.observe(v);
    v.addEventListener('loadeddata', () => start(v));
  });

  /* a backgrounded tab keeps decoders alive on some phones — release them */
  addEventListener('visibilitychange', () => {
    if (document.hidden) vids.forEach(stop);
    else vids.forEach(v => { if (v.dataset.vis === '1') start(v); });
  });
})();
/* autofocus pull — drop the backdrop layer once the rack focus has settled */
(() => {
  const fp = document.querySelector('.focus-pull');
  if (fp) fp.addEventListener('animationend', () => fp.remove());
})();
/* apparitions rail — hover & scroll: vertical wheel drives the reel sideways */
(() => {
  const rail = document.getElementById('ap-rail');
  if (!rail) return;
  rail.addEventListener('wheel', e => {
    if (rail.scrollWidth <= rail.clientWidth) return;
    e.preventDefault();
    rail.scrollLeft += (e.deltaY || e.deltaX);
  }, {passive:false});
})();
/* hero ticker — "Design studio for": current line wipes up and out,
   the next fades up from below, looping forever */
(() => {
  const items = [...document.querySelectorAll('#studio-rot > span')];
  if (!items.length) return;
  let i = 0;
  items[0].classList.add('on');
  setInterval(() => {
    const cur = items[i];
    i = (i + 1) % items.length;
    const nxt = items[i];
    cur.classList.remove('on'); cur.classList.add('off');
    setTimeout(() => cur.classList.remove('off'), 700);
    nxt.classList.add('on');
  }, 3200);
})();
</script>

<!-- LIVE CONTROL PANEL OVERLAY -->
<div id="admin-panel" style="position:fixed;top:0;left:0;bottom:0;width:340px;background:#0d110f;color:#edf1ec;font-family:'Space Grotesk',sans-serif;z-index:99999;box-shadow:5px 0 30px rgba(0,0,0,0.8);transform:translateX(-100%);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);display:flex;flex-direction:column;border-right:1px solid rgba(237,241,236,0.15);direction:ltr;text-align:left;">
  <div style="padding:20px;border-bottom:1px solid rgba(237,241,236,0.1);display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:10px;">
      <div id="panel-dot" style="width:10px;height:10px;border-radius:50%;background:var(--mint, #f0a800);"></div>
      <span style="font-weight:700;font-size:15px;letter-spacing:0.05em;">LIVE CONTROL PANEL</span>
    </div>
    <button id="panel-close" style="background:none;border:none;color:#edf1ec;font-size:18px;cursor:pointer;padding:4px 8px;">✕</button>
  </div>
  
  <div style="display:flex;border-bottom:1px solid rgba(237,241,236,0.1);background:rgba(0,0,0,0.2);">
    <button class="panel-tab active" data-tab="tab-colors" style="flex:1;padding:12px 6px;background:none;border:none;color:#edf1ec;font-size:11px;font-weight:600;cursor:pointer;border-bottom:2px solid var(--mint, #f0a800);">Colors</button>
    <button class="panel-tab" data-tab="tab-fonts" style="flex:1;padding:12px 6px;background:none;border:none;color:#a1a1aa;font-size:11px;font-weight:600;cursor:pointer;">Fonts</button>
    <button class="panel-tab" data-tab="tab-sections" style="flex:1;padding:12px 6px;background:none;border:none;color:#a1a1aa;font-size:11px;font-weight:600;cursor:pointer;">Sections</button>
    <button class="panel-tab" data-tab="tab-typography" style="flex:1;padding:12px 6px;background:none;border:none;color:#a1a1aa;font-size:11px;font-weight:600;cursor:pointer;">Type</button>
  </div>

  <div style="flex:1;overflow-y:auto;padding:20px;">
    <!-- TAB 1: COLORS -->
    <div id="tab-colors" class="panel-content" style="display:block;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:12px;">Accent & Mint Token</h3>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;margin-bottom:6px;">Accent Color (--mint)</label>
        <div style="display:flex;align-items:center;gap:10px;">
          <input type="color" id="accent-color-picker" value="#f0a800" style="width:40px;height:40px;border:none;border-radius:8px;cursor:pointer;background:none;" />
          <input type="text" id="accent-color-text" value="#f0a800" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:8px 12px;border-radius:8px;font-family:monospace;font-size:13px;" />
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;margin-bottom:6px;">Quick Presets</label>
        <div style="display:flex;gap:8px;">
          <button class="palette-btn" data-color="#f0a800" style="width:32px;height:32px;border-radius:50%;background:#f0a800;border:none;cursor:pointer;" title="Gold"></button>
          <button class="palette-btn" data-color="#facc15" style="width:32px;height:32px;border-radius:50%;background:#facc15;border:none;cursor:pointer;" title="Bumim Yellow"></button>
          <button class="palette-btn" data-color="#3b82f6" style="width:32px;height:32px;border-radius:50%;background:#3b82f6;border:none;cursor:pointer;" title="Blue"></button>
          <button class="palette-btn" data-color="#ec4899" style="width:32px;height:32px;border-radius:50%;background:#ec4899;border:none;cursor:pointer;" title="Pink"></button>
          <button class="palette-btn" data-color="#f97316" style="width:32px;height:32px;border-radius:50%;background:#f97316;border:none;cursor:pointer;" title="Orange"></button>
        </div>
      </div>
    </div>

    <!-- TAB 2: FONTS -->
    <div id="tab-fonts" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:12px;">Primary Font Family</h3>
      <div style="margin-bottom:16px;">
        <select id="font-family-select" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:10px 12px;border-radius:8px;font-size:13px;cursor:pointer;">
          <option value="'Space Grotesk', sans-serif">Space Grotesk (Default)</option>
          <option value="'Vazirmatn', sans-serif">Vazirmatn (Persian)</option>
          <option value="'Inter', sans-serif">Inter (Sans)</option>
          <option value="system-ui, sans-serif">System UI</option>
        </select>
      </div>
    </div>

    <!-- TAB 3: SECTIONS -->
    <div id="tab-sections" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:12px;">Hide / Show Sections</h3>
      <div id="sections-toggles" style="display:flex;flex-direction:column;gap:12px;">
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="hero" checked style="accent-color:var(--mint, #f0a800);" /> Hero Section</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="manifesto" checked style="accent-color:var(--mint, #f0a800);" /> Manifesto (The Unseen Author)</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="strip" checked style="accent-color:var(--mint, #f0a800);" /> Selected Treatments</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="real" checked style="accent-color:var(--mint, #f0a800);" /> Campaigns</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="ai" checked style="accent-color:var(--mint, #f0a800);" /> AI in the Pipeline</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="appar" checked style="accent-color:var(--mint, #f0a800);" /> Apparitions</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="credits" checked style="accent-color:var(--mint, #f0a800);" /> Credits & Logos</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="end" checked style="accent-color:var(--mint, #f0a800);" /> Brief / Contact</label>
      </div>
    </div>

    <!-- TAB 4: TYPOGRAPHY TOKENS -->
    <div id="tab-typography" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:12px;">Typography Tokens</h3>
      <div style="margin-bottom:14px;">
        <label style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;"><span>Hero Title Size</span><span id="val-hero-size">72px</span></label>
        <input type="range" id="token-hero-size" min="40" max="120" value="72" style="width:100%;accent-color:var(--mint, #f0a800);" />
      </div>
      <div style="margin-bottom:14px;">
        <label style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;"><span>Section Title Size</span><span id="val-sec-size">48px</span></label>
        <input type="range" id="token-sec-size" min="24" max="80" value="48" style="width:100%;accent-color:var(--mint, #f0a800);" />
      </div>
    </div>
  </div>

  <div style="padding:16px 20px;border-top:1px solid rgba(237,241,236,0.1);background:rgba(0,0,0,0.3);display:flex;gap:10px;">
    <button id="panel-apply" style="flex:1;background:var(--mint, #f0a800);color:#050706;border:none;padding:12px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">Apply & Save</button>
    <button id="panel-reset" style="background:rgba(255,255,255,0.08);color:#edf1ec;border:none;padding:12px 14px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;">Reset</button>
    <button id="panel-logout" style="background:rgba(255,120,120,0.12);color:#ff9c9c;border:none;padding:12px 14px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;">Log out</button>
  </div>
</div>

<button id="panel-toggle" style="position:fixed;top:50%;left:0;transform:translateY(-50%);width:36px;height:48px;background:#0d110f;color:var(--mint, #f0a800);border:1px solid rgba(237,241,236,0.2);border-left:none;border-radius:0 8px 8px 0;z-index:9998;cursor:pointer;display:none;align-items:center;justify-content:center;font-size:18px;box-shadow:4px 0 15px rgba(0,0,0,0.5);" title="Open Live Control Panel">⚙️</button>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('admin-panel');
  const toggleBtn = document.getElementById('panel-toggle');
  const closeBtn = document.getElementById('panel-close');
  const applyBtn = document.getElementById('panel-apply');
  const resetBtn = document.getElementById('panel-reset');
  const logoutBtn = document.getElementById('panel-logout');
  const colorPicker = document.getElementById('accent-color-picker');
  const colorText = document.getElementById('accent-color-text');
  const fontSelect = document.getElementById('font-family-select');
  const heroSizeRange = document.getElementById('token-hero-size');
  const heroSizeVal = document.getElementById('val-hero-size');
  const secSizeRange = document.getElementById('token-sec-size');
  const secSizeVal = document.getElementById('val-sec-size');
  const panelDot = document.getElementById('panel-dot');
  // --- Admin session gate: the panel only appears for authenticated admins ---
  if (localStorage.getItem('bumim_admin') !== 'granted') {
    if (toggleBtn) toggleBtn.style.display = 'none';
    if (panel) panel.remove();
    return;
  }
  if (toggleBtn) toggleBtn.style.display = 'flex';


  // Load saved settings
  const saved = JSON.parse(localStorage.getItem('bumim_admin_settings') || '{}');
  if (saved.mint) {
    document.documentElement.style.setProperty('--mint', saved.mint);
    colorPicker.value = saved.mint;
    colorText.value = saved.mint;
    panelDot.style.background = saved.mint;
  }
  if (saved.font) {
    document.body.style.fontFamily = saved.font;
    fontSelect.value = saved.font;
  }

  // Toggle Panel
  toggleBtn.addEventListener('click', () => {
    panel.style.transform = 'translateX(0)';
    toggleBtn.style.display = 'none';
  });
  closeBtn.addEventListener('click', () => {
    panel.style.transform = 'translateX(-100%)';
    toggleBtn.style.display = 'flex';
  });

  // Tabs
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.panel-tab').forEach(t => {
        t.style.borderBottom = 'none';
        t.style.color = '#a1a1aa';
        t.classList.remove('active');
      });
      document.querySelectorAll('.panel-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      tab.style.borderBottom = '2px solid var(--mint, #f0a800)';
      tab.style.color = '#edf1ec';
      document.getElementById(tab.getAttribute('data-tab')).style.display = 'block';
    });
  });

  // Color change live (universal mint token binding)
  const applyAccentColor = (hex) => {
    document.documentElement.style.setProperty('--mint', hex);
    colorPicker.value = hex;
    colorText.value = hex;
    if (panelDot) panelDot.style.background = hex;
    if (toggleBtn) toggleBtn.style.color = hex;

    let styleTag = document.getElementById('comprehensive-accent-patch');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'comprehensive-accent-patch';
      document.head.appendChild(styleTag);
    }
    const cleanHex = hex.replace('#','');
    const enc = (s) => 'data:image/svg+xml,' + encodeURIComponent(s);
    const dotSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="4" fill="' + hex + '"/></svg>';
    const ringSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="12" fill="none" stroke="' + hex + '" stroke-width="1.5"/><circle cx="14" cy="14" r="3.5" fill="' + hex + '"/></svg>';
    const playSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="13" fill="#05070688" stroke="' + hex + '" stroke-width="1.5"/><path d="M13 10.5 L23 16 L13 21.5 Z" fill="' + hex + '"/></svg>';
    styleTag.textContent =
      'body.fine { cursor: url(' + enc(dotSvg) + ') 10 10, auto; }' +
      'body.fine a, body.fine button, body.fine .seg { cursor: url(' + enc(ringSvg) + ') 14 14, pointer; }' +
      'body.fine .rw-card { cursor: url(' + enc(playSvg) + ') 16 16, pointer; }' +
      '::selection { background: ' + hex + ' !important; color: #050706 !important; }' +
      '.ap-rail::-webkit-scrollbar-thumb { background: ' + hex + ' !important; }' +
      '#tl { border-top-color: ' + hex + '33 !important; }' +
      'body.playing .hud-tl .rec { background: ' + hex + ' !important; }' +
      '.hud-tr button { color: ' + hex + ' !important; border-bottom-color: ' + hex + '99 !important; }' +
      '.hud-tr button:hover { text-shadow: 0 0 14px ' + hex + ', 0 0 34px ' + hex + '88 !important; }' +
      '#tl .seg.on { background: ' + hex + '3b !important; }' +
      '#tl .seg.on .sg-no { color: ' + hex + ' !important; }' +
      '#tl .playhead { background: ' + hex + ' !important; }' +
      '#tl .playhead::before { border-top-color: ' + hex + ' !important; }' +
      '#tl .tl-sc .no { color: ' + hex + ' !important; }' +
      '.gh::before { color: ' + hex + ' !important; }' +
      '.slate .sc { color: ' + hex + ' !important; }' +
      '.studio-rot span { color: ' + hex + ' !important; }' +
      '#hero h1 .l2 em { color: ' + hex + ' !important; }' +
      '#hero .h-scroll .ln { background: linear-gradient(' + hex + ', transparent) !important; }' +
      '#manifesto h2 em { color: ' + hex + ' !important; }' +
      '.strip-end .se em { color: ' + hex + ' !important; }' +
      '.strip-prog i { background: ' + hex + ' !important; }' +
      '.rw-card:hover .rw-play { border-color: ' + hex + ' !important; }' +
      '.rw-card:hover .rw-play::before { border-left-color: ' + hex + ' !important; }' +
      '#appar .ap-head h2 em { color: ' + hex + ' !important; }' +
      '.nda-stamp { color: ' + hex + ' !important; }' +
      '.ap-railhint .tri { border-left-color: ' + hex + ' !important; }' +
      '.ap-note b { color: ' + hex + ' !important; }' +
      '.svc .s-i { color: ' + hex + ' !important; }' +
      '#ai .ai-state h2 em { color: ' + hex + ' !important; }' +
      '.brand:hover { color: ' + hex + ' !important; border-color: ' + hex + ' !important; }' +
      '.cr-roll .cr .role { color: ' + hex + ' !important; }' +
      '#end .cut em { color: ' + hex + ' !important; }' +
      '.end-cta a:hover { border-color: ' + hex + ' !important; color: ' + hex + ' !important; }' +
      '.legal-grid h4 { color: ' + hex + ' !important; }' +
      '#menu a .m-sc { color: ' + hex + ' !important; }' +
      '#menu a:hover .m-t { color: ' + hex + ' !important; }';

  };
  colorPicker.addEventListener('input', (e) => applyAccentColor(e.target.value));
  colorText.addEventListener('input', (e) => applyAccentColor(e.target.value));
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => applyAccentColor(btn.getAttribute('data-color')));
  });

  // Font family live
  fontSelect.addEventListener('change', (e) => {
    document.body.style.fontFamily = e.target.value;
  });

  // Section visibility toggles
  document.querySelectorAll('#sections-toggles input').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const secId = e.target.getAttribute('data-section');
      const el = document.getElementById(secId);
      if (el) {
        el.style.display = e.target.checked ? '' : 'none';
      }
    });
  });

  // Typography range sliders live
  heroSizeRange.addEventListener('input', (e) => {
    const val = e.target.value + 'px';
    heroSizeVal.textContent = val;
    document.querySelectorAll('h1').forEach(h => h.style.fontSize = val);
  });
  secSizeRange.addEventListener('input', (e) => {
    const val = e.target.value + 'px';
    secSizeVal.textContent = val;
    document.querySelectorAll('h2').forEach(h => h.style.fontSize = val);
  });

  // Apply & Save
  applyBtn.addEventListener('click', () => {
    const settings = {
      mint: colorPicker.value,
      font: fontSelect.value
    };
    localStorage.setItem('bumim_admin_settings', JSON.stringify(settings));
    
    // Success toast notification
    const toast = document.createElement('div');
    toast.textContent = '✓ Changes applied & saved successfully!';
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--mint, #f0a800);color:#050706;padding:12px 24px;border-radius:12px;font-weight:700;z-index:100000;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-size:14px;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('bumim_admin_settings');
    location.reload();
  });

  // Log out
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('bumim_admin');
    location.href = '/admin';
  });
});
</script>

` }} />
  );
}
