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
  <a href="#pricing"><span class="m-sc">SC 01</span><span class="m-t">Rate card</span></a>
  <a href="#manifesto"><span class="m-sc">SC 02</span><span class="m-t">The unseen author</span></a>
  <a href="#strip"><span class="m-sc">SC 03</span><span class="m-t">Selected treatments</span></a>
  <a href="#real"><span class="m-sc">SC 04</span><span class="m-t">Pitches that became campaigns</span></a>
  <a href="#ai"><span class="m-sc">SC 05</span><span class="m-t">AI in the pipeline</span></a>
  <a href="#appar"><span class="m-sc">SC 06</span><span class="m-t">Apparitions</span></a>
  <a href="#credits"><span class="m-sc">SC 07</span><span class="m-t">Credits</span></a>
  <a href="#end"><span class="m-sc">SC 08</span><span class="m-t">Got a brief?</span></a>
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

<!-- ============ SC 01 — PRICING ============ -->
<section id="pricing" data-sc="01" data-name="Rate card" data-dir="ltr" data-justify="start">
  <div id="pricing-root"></div>
</section>

<!-- ============ SC 02 — MANIFESTO ============ -->
<header class="slate reveal re" data-target="manifesto"><span class="sc">SC 02</span><span class="nm">The unseen author</span><span class="tk">Take 01 · MOS</span></header>
<section id="manifesto" data-sc="02" data-name="The unseen author">
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

<!-- ============ SC 03 — TREATMENTS ============ -->
<section id="strip" data-sc="03" data-name="Selected treatments">
  <div class="pin">
    <header class="slate reveal re" style="margin-bottom:5vh"><span class="sc">SC 03</span><span class="nm">Selected treatments</span><span class="tk">Take 01 · 05 boards</span></header>
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

<!-- ============ SC 04 — REALISED ============ -->
<header class="slate reveal re" data-target="real"><span class="sc">SC 04</span><span class="nm">Pitches that became campaigns</span><span class="tk">Take 01 · Sync sound</span></header>
<section id="real" data-sc="04" data-name="Realised">
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

<!-- ============ SC 05 — AI ============ -->
<header class="slate reveal re" data-target="ai"><span class="sc">SC 05</span><span class="nm">AI in the pipeline</span><span class="tk">Take 02 · VFX</span></header>
<section id="ai" data-sc="05" data-name="AI in the pipeline">
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

<!-- ============ SC 06 — APPARITIONS ============ -->
<header class="slate reveal re" data-target="appar"><span class="sc">SC 06</span><span class="nm">Apparitions</span><span class="tk">Take 01 · Credited</span></header>
<section id="appar" data-sc="06" data-name="Apparitions">
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

<!-- ============ SC 07 — CREDITS ============ -->
<header class="slate reveal re" data-target="credits"><span class="sc">SC 07</span><span class="nm">Credits</span><span class="tk">Roll · End titles</span></header>
<section id="credits" data-sc="07" data-name="Credits">
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

<!-- ============ SC 08 — END ============ -->
<section id="end" data-sc="08" data-name="Got a brief?">
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

/* =========================================================
   BUMIM — data-driven PRICING engine + live editor
   (pricing is fully editable from the Live Control Panel)
   ========================================================= */
const PRICING_KEY = 'bumim_pricing_v2';
const USD_RATE_KEY = 'bumim_usd_rate';
const PRICING_DEFAULT = {
  section: {
    eyebrow: 'Rate card — global pricing',
    title: 'Transparent <em>pricing.</em>',
    sub: 'A single dollar-based rate, set once. Every package below is priced from it automatically — change the exchange rate and the whole list recalculates.',
    showRate: true,
    rate: 230000,
    dir: 'ltr',
    justify: 'start'
  },
  services: [
    {
      id: 'svc-short', name: 'Short video', calc: 'per minute', dir: 'ltr', justify: 'start', best: 'short-pro',
      details: ['Reels, shorts, teasers and social cutdowns.'],
      packages: [
        { id: 'short-std', tier: 'Standard', name: 'Short video', desc: 'Clean cut, titles and a mix. Refresh-day turnaround.', ratio: 1.0, per: 'per minute', who: 'مناسب برای برندها و صفحات اجتماعی', pro: false, best: false,
          features: ['Cut + sound', 'Captions', '1 revision'] },
        { id: 'short-pro', tier: 'Pro', name: 'Short video', desc: 'Advanced pacing, sound design and motion titles.', ratio: 1.8, per: 'per minute', who: 'مناسب برای کمپین‌های تبلیغاتی', pro: true, best: true,
          features: ['Motion titles', 'Sound design', 'Color grade', '3 revisions'] }
      ]
    },
    {
      id: 'svc-long', name: 'Long video', calc: 'per hour', dir: 'ltr', justify: 'start', best: 'long-5',
      details: ['Documentaries, interviews and event films.'],
      packages: [
        { id: 'long-2', tier: 'Under 2h', name: 'Long video', desc: 'Documentaries, interviews and event films.', ratio: 6.0, per: 'per hour', who: 'مناسب برای رویداد و مصاحبه', pro: false, best: false, features: ['Multi-cam', 'Grade', '1 revision'] },
        { id: 'long-5', tier: 'Under 5h', name: 'Long video', desc: 'Multi-camera edits, talks and features.', ratio: 8.0, per: 'per hour', who: 'مناسب برای سخنرانی‌ها و همایش‌ها', pro: false, best: true, features: ['Multi-cam', 'Grade', 'Sound', '2 revisions'] },
        { id: 'long-10', tier: 'Under 10h', name: 'Long video', desc: 'Extended features and full productions.', ratio: 11.0, per: 'per hour', who: 'مناسب برای مستندهای بلند', pro: false, best: false, features: ['Full grade', 'Sound', '3 revisions'] },
        { id: 'long-plus', tier: '10h+', name: 'Long video', desc: 'Large-scale series and long-form content.', ratio: 15.0, per: 'per hour', who: 'مناسب برای سریال و محتوای حرفه‌ای', pro: false, best: false, features: ['Dedicated edit suite', 'Unlimited revisions'] }
      ]
    },
    {
      id: 'svc-mg2d', name: 'Motion graphics 2D', calc: 'per second', dir: 'ltr', justify: 'start', best: 'mg2d-pro',
      details: ['Loops, lower-thirds and clean animation.'],
      packages: [
        { id: 'mg2d-std', tier: 'Standard', name: '2D motion', desc: 'Loops, lower-thirds and clean animation.', ratio: 2.0, per: 'per second', who: 'مناسب برای اینفوگرافیک و لوگوموشن', pro: false, best: false, features: ['Keyframes', 'Titles', '1 revision'] },
        { id: 'mg2d-pro', tier: 'Pro', name: '2D motion', desc: 'Character, kinetic type and branded animation.', ratio: 3.2, per: 'per second', who: 'مناسب برای برندسازی و آگهی', pro: true, best: true, features: ['Character rig', 'Kinetic type', '3 revisions'] }
      ]
    },
    {
      id: 'svc-mg3d', name: 'Motion graphics 3D', calc: 'per second', dir: 'ltr', justify: 'start', best: 'mg3d-pro',
      details: ['3D titles, product and camera moves.'],
      packages: [
        { id: 'mg3d-std', tier: 'Standard', name: '3D motion', desc: '3D titles, product and camera moves.', ratio: 4.5, per: 'per second', who: 'مناسب برای معرفی محصول', pro: false, best: false, features: ['3D scene', 'Camera move', '1 revision'] },
        { id: 'mg3d-pro', tier: 'Pro', name: '3D motion', desc: 'Full 3D scenes, lighting and rendering.', ratio: 7.0, per: 'per second', who: 'مناسب برای تیزر محصولات لوکس', pro: true, best: true, features: ['Full 3D', 'Lighting', 'Render farm', '3 revisions'] }
      ]
    },
    {
      id: 'svc-narr', name: 'Narration', calc: 'per second · per minute', dir: 'ltr', justify: 'start', best: 'narr-ad',
      details: ['Voice-over for commercials and long-form.'],
      packages: [
        { id: 'narr-ad', tier: 'Advertisement', name: 'Voice-over', desc: 'Commercial and promotional spots.', ratio: 1.2, per: 'per second', who: 'مناسب برای آگهی‌های تلویزیونی', pro: false, best: true, features: ['Studio VO', '1 revision'] },
        { id: 'narr-short', tier: 'Short content', name: 'Voice-over', desc: 'Social and short-form narration.', ratio: 0.8, per: 'per second', who: 'مناسب برای محتوای شبکه‌های اجتماعی', pro: false, best: false, features: ['Fast pickup'] },
        { id: 'narr-long', tier: 'Long content', name: 'Voice-over', desc: 'Documentary and long-form narrations.', ratio: 5.0, per: 'per minute', who: 'مناسب برای مستندها و کتاب صوتی', pro: false, best: false, features: ['Full session', '2 revisions'] }
      ]
    },
    {
      id: 'svc-gd', name: 'Graphic design', calc: 'per design', dir: 'ltr', justify: 'start', best: 'gd-instagram',
      details: ['Stories, thumbnails and full social sets.'],
      packages: [
        { id: 'gd-story', tier: 'Story', name: 'Story design', desc: 'Vertical story frames for social.', ratio: 0.5, per: 'each', who: 'مناسب برای استوری و پست روزانه', pro: false, best: false, features: ['1 frame'] },
        { id: 'gd-thumb', tier: 'Thumbnail', name: 'Thumbnail', desc: 'High-impression thumbnail design.', ratio: 1.0, per: 'each', who: 'مناسب برای کانال‌های یوتیوب', pro: false, best: false, features: ['CTR optimized'] },
        { id: 'gd-banner', tier: 'Banner', name: 'Banner', desc: 'Web and ad banner layouts.', ratio: 1.5, per: 'each', who: 'مناسب برای تبلیغات بنری', pro: false, best: false, features: ['Responsive'] },
        { id: 'gd-highlight', tier: 'Highlight', name: 'Highlight', desc: 'Highlight covers and tiles.', ratio: 1.2, per: 'each', who: 'مناسب برای هایلایت اینستاگرام', pro: false, best: false, features: ['Set of covers'] },
        { id: 'gd-instagram', tier: 'Full Instagram', name: 'Instagram set', desc: 'Full cohesive Instagram feed design.', ratio: 3.0, per: 'each', who: 'مناسب برای پیج‌های برند و فروشگاه', pro: false, best: true, features: ['Feed grid', 'Templates'] }
      ]
    },
    {
      id: 'svc-web', name: 'Website development', calc: 'per project', dir: 'ltr', justify: 'start', best: 'web-multi',
      details: ['Landing pages, CMS and custom apps.'],
      packages: [
        { id: 'web-landing', tier: 'Landing page', name: 'Website', desc: 'One-page landing site, responsive.', ratio: 8.0, per: 'per project', who: 'مناسب برای معرفی محصول و کمپین', pro: false, best: false, features: ['Responsive', 'SEO'] },
        { id: 'web-multi', tier: 'Multi-page', name: 'Website', desc: 'Multi-page site with CMS.', ratio: 15.0, per: 'per project', who: 'مناسب برای شرکت‌ها و کسب‌وکارها', pro: false, best: true, features: ['CMS', 'Blog', 'Forms'] },
        { id: 'web-app', tier: 'Web application', name: 'Website', desc: 'Custom app, dashboard or portal.', ratio: 30.0, per: 'per project', who: 'مناسب برای استارتاپ‌ها و پنل‌ها', pro: false, best: false, features: ['Database', 'Auth', 'API'] }
      ]
    }
  ]
};
function loadPricing(){
  try {
    const saved = JSON.parse(localStorage.getItem(PRICING_KEY));
    if (saved && saved.section && Array.isArray(saved.services) && saved.services.length) return saved;
  } catch(e){}
  return JSON.parse(JSON.stringify(PRICING_DEFAULT));
}
function savePricing(cfg){ try { localStorage.setItem(PRICING_KEY, JSON.stringify(cfg)); } catch(e){} }
let PRICING_CFG = loadPricing();
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtToman(n){ return Math.round(n).toLocaleString('en-US'); }
function prValText(rate, ratio){ return fmtToman((parseFloat(rate)||0) * (parseFloat(ratio)||0)); }

function renderPricing(){
  const root = document.getElementById('pricing-root');
  if (!root) return;
  const sec = PRICING_CFG.section;
  const sectionEl = document.getElementById('pricing');
  if (sectionEl){
    sectionEl.setAttribute('data-dir', sec.dir);
    sectionEl.setAttribute('data-justify', sec.justify);
  }
  const dirAttr = 'dir="' + esc(sec.dir) + '"';
  const ja = 'justify-content:' + esc(sec.justify) + ';';
  let h = '<div class="pr-head" ' + dirAttr + '>';
  h += '<p class="eyebrow reveal">' + esc(sec.eyebrow) + '</p>';
  h += '<h2 class="reveal">' + (sec.title || '') + '</h2>';
  h += '<p class="pr-sub reveal">' + esc(sec.sub) + '</p>';
  if (sec.showRate){
    h += '<div class="pr-rate reveal"><span class="pr-rate-dot"></span> 1 USD = <b id="pr-rate-val">' + fmtToman(sec.rate) + '</b>&nbsp;<span>تومان</span></div>';
  }
  h += '<div class="pr-tabs reveal" id="pr-tabs">';
  PRICING_CFG.services.forEach(function(svc, i){
    h += '<button class="pr-tab' + (i===0 ? ' on' : '') + '" data-grp="' + i + '">' + esc(svc.name) + '</button>';
  });
  h += '</div></div>';
  h += '<div class="pr-list">';
  PRICING_CFG.services.forEach(function(svc, si){
    h += '<div class="pr-svc reveal' + (si===0 ? ' on' : '') + '" data-grp="' + si + '" dir="' + esc(svc.dir||sec.dir) + '" data-justify="' + esc(svc.justify||sec.justify) + '">';
    h += '<div class="pr-svc-head"><span class="pr-svc-no">' + (si+1 < 10 ? '0'+(si+1) : si+1) + '</span><h3 class="pr-svc-name">' + esc(svc.name) + '</h3><span class="pr-svc-calc">' + esc(svc.calc) + '</span></div>';
    if (svc.details && svc.details.length){
      h += '<ul class="pr-features svc-details">';
      svc.details.forEach(function(d){ if (d) h += '<li>' + esc(d) + '</li>'; });
      h += '</ul>';
    }
    h += '<div class="pr-grid" style="justify-content:' + esc(svc.justify||sec.justify) + ';">';
    svc.packages.forEach(function(p){
      const isBest = String(svc.best) === String(p.id);
      h += '<article class="pr-card' + (p.pro ? ' pro' : '') +(isBest ? ' best' : '') + '" dir="' + esc(p.dir||svc.dir||sec.dir) + '">';
      if (isBest) h += '<div class="pr-best">★ Best sell — پرفروش</div>';
      h += '<div class="pr-tier">' + esc(p.tier) + '</div>';
      h += '<div class="pr-name">' + esc(p.name) + '</div>';
      h += '<div class="pr-desc">' + esc(p.desc) + '</div>';
      if (p.who) h += '<div class="pr-who"><b>Who is it for?</b> ' + esc(p.who) + '</div>';
      if (p.features && p.features.length){
        h += '<ul class="pr-features">';
        p.features.forEach(function(f){ if (f) h += '<li>' + esc(f) + '</li>'; });
        h += '</ul>';
      }
      h += '<div class="pr-price"><b class="pr-val" data-pkg="' + esc(p.id) + '" data-ratio="' + esc(p.ratio) + '" data-label="' + esc(p.name+' — '+p.tier) + '">' + prValText(sec.rate, p.ratio) + '</b><span class="pr-cur"> تومان</span></div>';
      h += '<div class="pr-per">' + esc(p.per) + '</div>';
      h += '</article>';
    });
    h += '</div></div>';
  });
  h += '</div>';
  root.innerHTML = h;
  updateRateText(sec.rate);
  bindPricingTabs();
  // Re-trigger reveals so freshly re-rendered pricing is visible after an edit/save.
  root.querySelectorAll('.pr-head .reveal').forEach(function(el){ el.classList.add('in'); });
  const _on = root.querySelector('.pr-svc.on');
  if (_on){ _on.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }
}
function updateRateText(rate){
  const rateEl = document.getElementById('pr-rate-val');
  if (rateEl) rateEl.textContent = fmtToman(parseFloat(rate)||0);
}
function applyRate(rate){
  const r = (typeof rate === 'number' && isFinite(rate)) ? rate
    : (parseFloat(PRICING_CFG.section.rate) || 230000);
  updateRateText(r);
  document.querySelectorAll('#pricing-root .pr-val').forEach(function(el){
    el.textContent = fmtToman(r * (parseFloat(el.dataset.ratio) || 0));
  });
}
let _prTabsBound = false;
function bindPricingTabs(){
  const wrap = document.getElementById('pr-tabs');
  if (!wrap) return;
  if (_prTabsBound){ return; }
  _prTabsBound = true;
  wrap.addEventListener('click', function(e){
    const t = e.target.closest ? e.target.closest('.pr-tab') : null;
    if (t){ activatePr(t.dataset.grp); }
  });
}
function activatePr(grp){
  document.querySelectorAll('#pr-tabs .pr-tab').forEach(function(t){
    t.classList.toggle('on', t.dataset.grp === grp);
  });
  document.querySelectorAll('#pricing-root .pr-svc[data-grp]').forEach(function(sec){
    const on = sec.dataset.grp === grp;
    sec.classList.toggle('on', on);
    if (on){ sec.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }
  });
}
renderPricing();



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
    <button class="panel-tab active" data-tab="tab-colors" style="flex:1;padding:12px 3px;background:none;border:none;color:#edf1ec;font-size:10px;font-weight:600;cursor:pointer;border-bottom:2px solid var(--mint, #f0a800);">Colors</button>
    <button class="panel-tab" data-tab="tab-fonts" style="flex:1;padding:12px 3px;background:none;border:none;color:#a1a1aa;font-size:10px;font-weight:600;cursor:pointer;">Fonts</button>
    <button class="panel-tab" data-tab="tab-sections" style="flex:1;padding:12px 3px;background:none;border:none;color:#a1a1aa;font-size:10px;font-weight:600;cursor:pointer;">Sections</button>
    <button class="panel-tab" data-tab="tab-page" style="flex:1;padding:12px 3px;background:none;border:none;color:#a1a1aa;font-size:10px;font-weight:600;cursor:pointer;">Page</button>
    <button class="panel-tab" data-tab="tab-typography" style="flex:1;padding:12px 3px;background:none;border:none;color:#a1a1aa;font-size:10px;font-weight:600;cursor:pointer;">Type</button>
    <button class="panel-tab" data-tab="tab-pricing" style="flex:1;padding:12px 3px;background:none;border:none;color:#a1a1aa;font-size:10px;font-weight:600;cursor:pointer;">Pricing</button>
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
          <option value="Bumim-Custom">Uploaded font…</option>
        </select>
      </div>
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:8px;">Upload a font (site-wide)</h3>
      <p style="font-size:11px;color:#76827a;margin-bottom:8px;">Choose a .woff2 / .woff / .ttf / .otf file. It is embedded and applied to all text. Upload &amp; save from the bottom bar.</p>
      <input type="file" id="font-upload" accept=".woff2,.woff,.ttf,.otf" style="width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px dashed rgba(255,255,255,0.25);border-radius:8px;color:#c9cdc9;font-size:12px;margin-bottom:4px;" />
      <p style="font-size:11px;color:var(--mint, #f0a800);margin-bottom:16px;" id="font-upload-status">No file selected.</p>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;margin-bottom:6px;">Weights for this font (comma separated)</label>
        <input type="text" id="font-weights" placeholder="400,700" style="width:100%;padding:8px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:8px;font-size:12px;box-sizing:border-box;" />
        <button id="font-remove" style="width:100%;margin-top:8px;background:rgba(255,120,120,0.12);color:#ff9c9c;border:1px solid rgba(255,120,120,0.25);padding:10px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;">Remove uploaded font</button>
      </div>
    </div>

    <!-- TAB 3: SECTIONS -->
    <div id="tab-sections" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:12px;">Hide / Show Sections</h3>
      <p style="font-size:11px;color:#76827a;margin-bottom:12px;">Toggles apply live. Section cards (SC 00–08), pricing, legal and footer are all covered.</p>
      <div id="sections-toggles" style="display:flex;flex-direction:column;gap:12px;">
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="hero" checked style="accent-color:var(--mint, #f0a800);" /> Hero Section</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="pricing" checked style="accent-color:var(--mint, #f0a800);" /> Pricing / Rate Card</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="manifesto" checked style="accent-color:var(--mint, #f0a800);" /> Manifesto (The Unseen Author)</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="strip" checked style="accent-color:var(--mint, #f0a800);" /> Selected Treatments</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="real" checked style="accent-color:var(--mint, #f0a800);" /> Campaigns</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="ai" checked style="accent-color:var(--mint, #f0a800);" /> AI in the Pipeline</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="appar" checked style="accent-color:var(--mint, #f0a800);" /> Apparitions</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="credits" checked style="accent-color:var(--mint, #f0a800);" /> Credits & Logos</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="end" checked style="accent-color:var(--mint, #f0a800);" /> Brief / Contact</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="legal" checked style="accent-color:var(--mint, #f0a800);" /> Fine Print / Legal</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="footer" checked style="accent-color:var(--mint, #f0a800);" /> Footer</label>
      </div>
    </div>

    <!-- TAB: PAGE (section editor: direction/justify + pricing text grid) -->
    <div id="tab-page" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:8px;">Section direction &amp; alignment</h3>
      <p style="font-size:11px;color:#76827a;margin-bottom:12px;">Set RTL / LTR and Start / Center / End for each section's content. Applies live via CSS data attributes.</p>
      <div id="section-dir" style="display:flex;flex-direction:column;gap:14px;"></div>
      <div style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;">
        <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:8px;">Pricing — card direction &amp; alignment</h3>
        <p style="font-size:11px;color:#76827a;margin-bottom:6px;">Per-service RTL/LTR and justify. Card texts, tiers, bullets and who-for are extended in the Pricing tab.</p>
        <div id="pricing-dir" style="display:flex;flex-direction:column;gap:14px;"></div>
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
    <div id="tab-pricing" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:8px;">Section title &amp; caption</h3>
      <p style="font-size:11px;color:#76827a;margin-bottom:6px;">Edit every text in this section (title may contain &lt;em&gt;).</p>
      <label style="display:block;font-size:12px;margin-bottom:4px;">Eyebrow</label>
      <input type="text" id="pr-eyebrow" style="width:100%;padding:8px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:8px;font-size:12px;box-sizing:border-box;margin-bottom:10px;" />
      <label style="display:block;font-size:12px;margin-bottom:4px;">Title (HTML allowed)</label>
      <input type="text" id="pr-title" style="width:100%;padding:8px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:8px;font-size:12px;box-sizing:border-box;margin-bottom:10px;" />
      <label style="display:block;font-size:12px;margin-bottom:4px;">Caption</label>
      <textarea id="pr-sub" rows="3" style="width:100%;padding:8px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:8px;font-size:12px;box-sizing:border-box;margin-bottom:12px;resize:vertical;"></textarea>
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer;margin-bottom:14px;"><input type="checkbox" id="pr-showrate" checked style="accent-color:var(--mint, #f0a800);" /> Show exchange-rate chip (hide the dollar price)</label>
      <label style="display:block;font-size:12px;margin-bottom:4px;">1 USD (in Toman)</label>
      <input type="number" id="usd-rate-input" value="230000" min="0" step="1000" style="width:100%;padding:10px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:8px;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:4px;" />
      <p style="font-size:11px;color:var(--mint, #f0a800);margin-bottom:14px;" id="usd-preview"></p>

      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:8px;">Services &amp; packages</h3>
      <p style="font-size:11px;color:#76827a;margin-bottom:6px;">Edit names, add / remove services and packages, set Best-sell and "Who is it for?".</p>
      <div id="pricing-services" style="display:flex;flex-direction:column;gap:16px;margin-bottom:14px;"></div>
      <button id="add-service" style="width:100%;background:rgba(255,255,255,0.08);color:#edf1ec;border:1px dashed rgba(255,255,255,0.25);padding:12px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;">+ Add a service</button>
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

  /* ============================ PERSISTED STATE ============================ */
  const SETTINGS_KEY = 'bumim_admin_settings';
  const SECTIONS_KEY = 'bumim_sections_visible';
  const FONT_KEY = 'bumim_font_custom';
  const FONT_NAME = 'Bumim-Custom';
  const SECTIONS = [
    ['hero', 'Hero Section'],
    ['pricing', 'Pricing / Rate Card'],
    ['manifesto', 'Manifesto (The Unseen Author)'],
    ['strip', 'Selected Treatments'],
    ['real', 'Campaigns'],
    ['ai', 'AI in the Pipeline'],
    ['appar', 'Apparitions'],
    ['credits', 'Credits & Logos'],
    ['end', 'Brief / Contact'],
    ['legal', 'Fine Print / Legal'],
    ['footer', 'Footer']
  ];
  let savedSections = {};
  try { savedSections = JSON.parse(localStorage.getItem(SECTIONS_KEY) || '{}'); } catch(e){}

  // Load saved settings
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  if (saved.mint) {
    document.documentElement.style.setProperty('--mint', saved.mint);
    colorPicker.value = saved.mint;
    colorText.value = saved.mint;
    panelDot.style.background = saved.mint;
  }
  if (saved.font) {
    if (saved.font === FONT_NAME) { applyCustomFont(); }
    else { document.body.style.fontFamily = saved.font; fontSelect.value = saved.font; }
  }

  /* ============================ PRICING EDITOR ============================ */
  const usdInput = document.getElementById('usd-rate-input');
  const usdPreview = document.getElementById('usd-preview');
  const prEyebrow = document.getElementById('pr-eyebrow');
  const prTitle = document.getElementById('pr-title');
  const prSub = document.getElementById('pr-sub');
  const prShowRate = document.getElementById('pr-showrate');
  const servicesWrap = document.getElementById('pricing-services');
  const addServiceBtn = document.getElementById('add-service');
  const getRate = () => parseFloat((usdInput||{}).value) || parseFloat(PRICING_CFG.section.rate) || 230000;
  const updateUsdPreview = () => {
    if (usdPreview) usdPreview.textContent = '1 USD = ' + fmtToman(parseFloat(usdInput.value||'0')) + ' تومان';
  };

  function valueOf(cfg, path, fallback){ return cfg; }

  function readEditorIntoCfg(){
    PRICING_CFG.section.eyebrow = prEyebrow ? prEyebrow.value : PRICING_CFG.section.eyebrow;
    PRICING_CFG.section.title = prTitle ? prTitle.value : PRICING_CFG.section.title;
    PRICING_CFG.section.sub = prSub ? prSub.value : PRICING_CFG.section.sub;
    PRICING_CFG.section.showRate = prShowRate ? prShowRate.checked : PRICING_CFG.section.showRate;
    PRICING_CFG.section.rate = parseFloat(usdInput ? usdInput.value : PRICING_CFG.section.rate) || 230000;
  }

  function fillEditorFromCfg(){
    if (prEyebrow) prEyebrow.value = PRICING_CFG.section.eyebrow;
    if (prTitle) prTitle.value = PRICING_CFG.section.title;
    if (prSub) prSub.value = PRICING_CFG.section.sub;
    if (prShowRate) prShowRate.checked = PRICING_CFG.section.showRate !== false;
    if (usdInput) usdInput.value = PRICING_CFG.section.rate;
  }

  // Build the service/package editor DOM
  function renderServicesEditor(){
    if (!servicesWrap) return;
    // Gather current field values first
    if (servicesWrap.dataset.dirty === '1'){
      readServicesEditorIntoCfg();
    }
    servicesWrap.innerHTML = '';
    PRICING_CFG.services.forEach(function(svc, si){
      const card = document.createElement('div');
      card.className = 'pe-svc';
      card.style.cssText = 'border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;background:rgba(255,255,255,0.03);';
      let html = '';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
      html += '<b style="font-size:13px;">#' + (si+1) + ' Service</b>';
      html += '<button class="pe-addpkg" data-si="'+si+'" style="background:rgba(255,255,255,0.08);color:#edf1ec;border:1px solid rgba(255,255,255,0.15);padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer;">+ Package</button>';
      html += '<button class="pe-del-svc" data-si="'+si+'" style="background:rgba(255,120,120,0.12);color:#ff9c9c;border:1px solid rgba(255,120,120,0.25);padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer;">Remove</button>';
      html += '</div>';
      html += '<label class="pe-lbl">Service name</label>';
      html += '<input class="pe-svc-name" data-si="'+si+'" value="'+esc(svc.name)+'" style="'+INP+'margin-bottom:8px;" />';
      html += '<label class="pe-lbl">Calc note (per second etc.)</label>';
      html += '<input class="pe-svc-calc" data-si="'+si+'" value="'+esc(svc.calc)+'" style="'+INP+'margin-bottom:8px;" />';
      html += '<label class="pe-lbl">Best-sell package</label>';
      html += '<select class="pe-svc-best" data-si="'+si+'" style="'+SELECT+'margin-bottom:8px;">';
      svc.packages.forEach(function(p){ html += '<option value="'+esc(p.id)+'"'+(String(svc.best)===String(p.id)?' selected':'')+'>'+esc(p.name+' — '+p.tier)+'</option>'; });
      html += '</select>';
      html += '<label class="pe-lbl">Service details (one per line)</label>';
      html += '<textarea class="pe-svc-details" data-si="'+si+'" rows="2" style="'+INP+'margin-bottom:10px;resize:vertical;">'+esc((svc.details||[]).join('\\n'))+'</textarea>';
      card.innerHTML = html;
      servicesWrap.appendChild(card);
      // Package sub-cards
      svc.packages.forEach(function(p, pi){
        card.appendChild(buildPkgCard(si, pi, p));
      });
    });
    servicesWrap.dataset.dirty = '0';
  }
  const INP = 'width:100%;padding:7px 9px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:6px;font-size:12px;box-sizing:border-box;font-family:inherit;';
  const SELECT = 'width:100%;padding:7px 9px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:6px;font-size:12px;box-sizing:border-box;';

  function buildPkgCard(si, pi, p){
    const wrap = document.createElement('div');
    wrap.className = 'pe-pkg';
    wrap.style.cssText = 'border:1px solid rgba(237,241,236,0.1);border-radius:8px;padding:10px;margin-top:10px;background:rgba(0,0,0,0.18);';
    let html = '';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    html += '<b style="font-size:12px;color:#c9cdc9;">Package ' + (pi+1) + '</b>';
    html += '<label style="display:flex;align-items:center;gap:6px;font-size:11px;cursor:pointer;"><input class="pe-pkg-pro" data-si="'+si+'" data-pi="'+pi+'" type="checkbox"'+(p.pro?' checked':'')+' style="accent-color:var(--mint, #f0a800);" /> Pro</label>';
    html += '<button class="pe-del-pkg" data-si="'+si+'" data-pi="'+pi+'" style="background:rgba(255,120,120,0.12);color:#ff9c9c;border:1px solid rgba(255,120,120,0.25);padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">Remove</button>';
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">';
    html += '<div><label class="pe-lbl">Tier</label><input class="pe-pkg-tier" data-si="'+si+'" data-pi="'+pi+'" value="'+esc(p.tier)+'" style="'+INP+'" /></div>';
    html += '<div><label class="pe-lbl">Name</label><input class="pe-pkg-name" data-si="'+si+'" data-pi="'+pi+'" value="'+esc(p.name)+'" style="'+INP+'" /></div>';
    html += '</div>';
    html += '<label class="pe-lbl">Description</label>';
    html += '<input class="pe-pkg-desc" data-si="'+si+'" data-pi="'+pi+'" value="'+esc(p.desc)+'" style="'+INP+'margin-bottom:8px;" />';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;">';
    html += '<div><label class="pe-lbl">Ratio</label><input class="pe-pkg-ratio" data-si="'+si+'" data-pi="'+pi+'" type="number" step="0.1" value="'+p.ratio+'" style="'+INP+'" /></div>';
    html += '<div><label class="pe-lbl">Per</label><input class="pe-pkg-per" data-si="'+si+'" data-pi="'+pi+'" value="'+esc(p.per)+'" style="'+INP+'" /></div>';
    html += '<div><label class="pe-lbl">ID</label><input class="pe-pkg-id" data-si="'+si+'" data-pi="'+pi+'" value="'+esc(p.id)+'" style="'+INP+'" /></div>';
    html += '</div>';
    html += '<label class="pe-lbl">Who is it for? (مناسب برای …)</label>';
    html += '<input class="pe-pkg-who" data-si="'+si+'" data-pi="'+pi+'" value="'+esc(p.who||'')+'" style="'+INP+'margin-bottom:8px;" />';
    html += '<label class="pe-lbl">Includes (one bullet per line)</label>';
    html += '<textarea class="pe-pkg-features" data-si="'+si+'" data-pi="'+pi+'" rows="2" style="'+INP+'resize:vertical;">'+esc((p.features||[]).join('\\n'))+'</textarea>';
    wrap.innerHTML = html;
    return wrap;
  }

  function readServicesEditorIntoCfg(){
    // service-level
    PRICING_CFG.services.forEach(function(svc, si){
      const name = document.querySelector('.pe-svc-name[data-si="'+si+'"]');
      const calc = document.querySelector('.pe-svc-calc[data-si="'+si+'"]');
      const best = document.querySelector('.pe-svc-best[data-si="'+si+'"]');
      const details = document.querySelector('.pe-svc-details[data-si="'+si+'"]');
      if (name) svc.name = name.value;
      if (calc) svc.calc = calc.value;
      if (best) svc.best = best.value;
      if (details) svc.details = details.value.split('\\n').map(s=>s.trim()).filter(Boolean);
      // package-level
      svc.packages.forEach(function(p, pi){
        const g = function(cls){ return document.querySelector(cls+'[data-si="'+si+'"][data-pi="'+pi+'"]'); };
        const tier=g('.pe-pkg-tier'), nm=g('.pe-pkg-name'), desc=g('.pe-pkg-desc'), ratio=g('.pe-pkg-ratio'),
              per=g('.pe-pkg-per'), id=g('.pe-pkg-id'), who=g('.pe-pkg-who'), feats=g('.pe-pkg-features'), pro=g('.pe-pkg-pro');
        if (tier) p.tier=tier.value; if (nm) p.name=nm.value; if (desc) p.desc=desc.value;
        if (ratio) p.ratio=parseFloat(ratio.value)||0; if (per) p.per=per.value; if (id) p.id=id.value;
        if (who) p.who=who.value; if (pro) p.pro=pro.checked;
        if (feats) p.features = feats.value.split('\\n').map(s=>s.trim()).filter(Boolean);
      });
    });
  }

  function refreshAll(){
    readEditorIntoCfg();
    readServicesEditorIntoCfg();
    savePricing(PRICING_CFG);
    renderPricing();
    fillEditorFromCfg();
  }

  function rebuildSvcSelects(){
    // best-sell options changed
    PRICING_CFG.services.forEach(function(svc, si){
      const sel = document.querySelector('.pe-svc-best[data-si="'+si+'"]');
      if (!sel) return;
      const prev = sel.value;
      sel.innerHTML = '';
      svc.packages.forEach(function(p){
        const o=document.createElement('option'); o.value=p.id; o.textContent=p.name+' — '+p.tier;
        sel.appendChild(o);
      });
      if (prev && svc.packages.some(p=>p.id===prev)) sel.value=prev;
    });
  }

  function attachServicesEvents(){
    if (!servicesWrap) return;
    servicesWrap.addEventListener('input', function(e){ servicesWrap.dataset.dirty='1'; });
    servicesWrap.addEventListener('change', function(e){ servicesWrap.dataset.dirty='1'; });
    servicesWrap.addEventListener('click', function(e){
      const t = e.target;
      if (t.classList.contains('pe-del-svc')){
        const si = parseInt(t.dataset.si,10);
        readServicesEditorIntoCfg();
        PRICING_CFG.services.splice(si,1);
        renderServicesEditor();
      } else if (t.classList.contains('pe-addpkg')){
        const si = parseInt(t.dataset.si,10);
        readServicesEditorIntoCfg();
        const svc = PRICING_CFG.services[si];
        const nid = 'pkg-'+si+'-'+Date.now();
        svc.packages.push({ id:nid, tier:'New', name:'Package', desc:'', ratio:1, per:'per item', who:'', pro:false, features:[] });
        renderServicesEditor();
      } else if (t.classList.contains('pe-del-pkg')){
        const si = parseInt(t.dataset.si,10), pi = parseInt(t.dataset.pi,10);
        readServicesEditorIntoCfg();
        PRICING_CFG.services[si].packages.splice(pi,1);
        renderServicesEditor();
      }
    });
  }

  function initPricingEditor(){
    fillEditorFromCfg();
    updateUsdPreview();
    renderServicesEditor();
    attachServicesEvents();
    if (prEyebrow) prEyebrow.addEventListener('input', () => { PRICING_CFG.section.eyebrow = prEyebrow.value; renderPricing(); });
    if (prTitle) prTitle.addEventListener('input', () => { PRICING_CFG.section.title = prTitle.value; renderPricing(); });
    if (prSub) prSub.addEventListener('input', () => { PRICING_CFG.section.sub = prSub.value; renderPricing(); });
    if (prShowRate) prShowRate.addEventListener('change', () => { PRICING_CFG.section.showRate = prShowRate.checked; renderPricing(); });
    if (usdInput) usdInput.addEventListener('input', () => {
      PRICING_CFG.section.rate = parseFloat(usdInput.value) || 230000;
      applyRate(PRICING_CFG.section.rate);
      updateUsdPreview();
    });
    if (addServiceBtn) addServiceBtn.addEventListener('click', () => {
      readServicesEditorIntoCfg();
      PRICING_CFG.services.push({ id:'svc-'+Date.now(), name:'New service', calc:'per item', dir:'ltr', justify:'start', best:'', details:[], packages:[{ id:'pkg-'+Date.now(), tier:'Standard', name:'Package', desc:'', ratio:1, per:'per item', who:'', pro:false, features:[] }] });
      renderServicesEditor();
    });
  }
  if (usdInput) usdInput.value = PRICING_CFG.section.rate;
  initPricingEditor();

  /* ============================ PAGE (section speed/direction) ============================ */
  const secDirWrap = document.getElementById('section-dir');
  const pricingDirWrap = document.getElementById('pricing-dir');
  const SECTION_LIST = [
    ['hero','Hero'],['pricing','Pricing / Rate Card'],['manifesto','Manifesto'],['strip','Selected Treatments'],
    ['real','Campaigns'],['ai','AI Pipeline'],['appar','Apparitions'],['credits','Credits'],
    ['end','Brief / Contact']
  ];
  function dirSelectFor(key, curDir, curJust){
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;';
    const ds = document.createElement('select');
    ds.style.cssText = SELECT;
    ['ltr','rtl'].forEach(function(v){ const o=document.createElement('option'); o.value=v; o.textContent=v.toUpperCase(); ds.appendChild(o); });
    ds.value = curDir || 'ltr';
    const js = document.createElement('select');
    js.style.cssText = SELECT;
    ['start','center','end'].forEach(function(v){ const o=document.createElement('option'); o.value=v; o.textContent=v[0].toUpperCase()+v.slice(1); js.appendChild(o); });
    js.value = curJust || 'start';
    wrap.appendChild(ds); wrap.appendChild(js);
    return {wrap:wrap, dirSel:ds, justSel:js};
  }
  function buildSectionDir(){
    if (secDirWrap){
      secDirWrap.innerHTML = '';
      SECTION_LIST.forEach(function(pair){
        const secEl = document.getElementById(pair[0]);
        const curDir = secEl ? (secEl.getAttribute('data-dir')||'ltr') : 'ltr';
        const curJust = secEl ? (secEl.getAttribute('data-justify')||'start') : 'start';
        const row = document.createElement('div');
        row.style.cssText = 'padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);';
        row.innerHTML = '<div style="font-weight:600;font-size:12px;margin-bottom:6px;">'+pair[1]+'</div>';
        const c = dirSelectFor(pair[0], curDir, curJust);
        row.appendChild(c.wrap);
        const id = sectionKeyFromLabel(pair[1]);
        c.dirSel.addEventListener('change', function(){
          const el = document.getElementById(id);
          if (el){ el.setAttribute('data-dir', c.dirSel.value); }
          if (id === 'pricing'){ PRICING_CFG.section.dir = c.dirSel.value; renderPricing(); }
        });
        c.justSel.addEventListener('change', function(){
          const el = document.getElementById(id);
          if (el){ el.setAttribute('data-justify', c.justSel.value); }
          if (id === 'pricing'){ PRICING_CFG.section.justify = c.justSel.value; renderPricing(); }
        });
        secDirWrap.appendChild(row);
      });
    }
    if (pricingDirWrap){
      // Per-service direction for pricing
      pricingDirWrap.innerHTML = '';
      function rebuildPricingDir(){
        readServicesEditorIfDirty();
        pricingDirWrap.innerHTML = '';
        PRICING_CFG.services.forEach(function(svc, si){
          const row = document.createElement('div');
          row.style.cssText = 'padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);';
          row.innerHTML = '<div style="font-weight:600;font-size:12px;margin-bottom:6px;">'+esc(svc.name)+'</div>';
          const c = dirSelectFor('svc', svc.dir||'ltr', svc.justify||'start');
          row.appendChild(c.wrap);
          c.dirSel.addEventListener('change', function(){ svc.dir = c.dirSel.value; renderPricing(); });
          c.justSel.addEventListener('change', function(){ svc.justify = c.justSel.value; renderPricing(); });
          pricingDirWrap.appendChild(row);
        });
      }
      rebuildPricingDir();
      pricingDirWrap.dataset.rebuild = String(rebuildPricingDir);
    }
  }
  function readServicesEditorIfDirty(){
    if (servicesWrap && servicesWrap.dataset.dirty === '1'){
      readServicesEditorIntoCfg();
      servicesWrap.dataset.dirty = '0';
    }
  }
  function sectionKeyFromLabel(label){
    // map label -> id from SECTIONS list
    const hit = SECTIONS.find(function(s){ return s[1]===label; });
    return hit ? hit[0] : label;
  }
  buildSectionDir();

  /* ============================ SECTION VISIBILITY ============================ */
  function applySectionVisibility(){
    SECTIONS.forEach(function(pair){
      const id = pair[0];
      const chk = document.querySelector('#sections-toggles input[data-section="'+id+'"]');
      const el = document.getElementById(id);
      const show = savedSections[id] !== false;
      if (el) el.style.display = show ? '' : 'none';
      if (chk) chk.checked = show;
      // Hide the loose slate header that precedes / belongs to this section
      const slate = document.querySelector('header[data-target="'+id+'"]');
      if (slate) slate.style.display = show ? '' : 'none';
    });
  }
  function buildSectionsToggles(){
    const wrap = document.getElementById('sections-toggles');
    if (!wrap) return;
    wrap.innerHTML = '';
    SECTIONS.forEach(function(pair){
      const id = pair[0], label = pair[1];
      const labelEl = document.createElement('label');
      labelEl.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;';
      labelEl.innerHTML = '<input type="checkbox" data-section="'+id+'"'+(savedSections[id]!==false?' checked':'')+' style="accent-color:var(--mint, #f0a800);" /> '+label;
      wrap.appendChild(labelEl);
    });
    wrap.addEventListener('change', function(e){
      const input = e.target;
      if (!input || !input.dataset.section) return;
      const id = input.dataset.section;
      savedSections[id] = input.checked;
      const el = document.getElementById(id);
      if (el) el.style.display = input.checked ? '' : 'none';
      const slate = document.querySelector('header[data-target="'+id+'"]');
      if (slate) slate.style.display = input.checked ? '' : 'none';
      try { localStorage.setItem(SECTIONS_KEY, JSON.stringify(savedSections)); } catch(err){}
    });
  }
  buildSectionsToggles();
  applySectionVisibility();

  /* ============================ FONT UPLOAD (item 13) ============================ */
  const fontUpload = document.getElementById('font-upload');
  const fontWeights = document.getElementById('font-weights');
  const fontUploadStatus = document.getElementById('font-upload-status');
  const fontRemove = document.getElementById('font-remove');
  let pendingFont = null;
  function applyCustomFont(){
    try {
      const data = JSON.parse(localStorage.getItem(FONT_KEY));
      if (data && data.url){
        let style = document.getElementById('bumim-font-face');
        if (!style){
          style = document.createElement('style');
          style.id = 'bumim-font-face';
          document.head.appendChild(style);
        }
        const w = (data.weights || '400').split(',').map(s=>s.trim()).filter(Boolean);
        let css = '';
        w.forEach(function(weight){
          css += '@font-face{font-family:"'+FONT_NAME+'";font-style:normal;font-weight:'+weight+';src:url('+data.url+') format("'+data.format+'");}' ;
        });
        css += 'body,body .hud,body .panel-tab,body input,body select,body textarea,body button{font-family:"'+FONT_NAME+'", sans-serif !important;}';
        style.textContent = css;
        document.body.style.fontFamily = '"'+FONT_NAME+'", sans-serif';
        fontSelect.value = FONT_NAME;
      }
    } catch(e){}
  }
  if (fontUpload){
    fontUpload.addEventListener('change', function(){
      const file = fontUpload.files && fontUpload.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(){
        const urlBase = reader.result;
        const ext = (file.name.split('.').pop()||'').toLowerCase();
        const formatMap = { woff:'woff', woff2:'woff2', ttf:'truetype', otf:'opentype' };
        pendingFont = { name:file.name, url:urlBase, format:formatMap[ext]||'woff2', weights:(fontWeights?fontWeights.value:'400')||'400' };
        if (fontUploadStatus) fontUploadStatus.textContent = 'Ready: ' + file.name + ' (' + (Math.round(file.size/1024)) + ' KB). Press Apply & Save to embed.';
        // live preview
        pendingPreview();
      };
      reader.readAsDataURL(file);
    });
    function pendingPreview(){
      if (!pendingFont) return;
      let style = document.getElementById('bumim-font-preview');
      if (!style){ style = document.createElement('style'); style.id='bumim-font-preview'; document.head.appendChild(style); }
      const w = (pendingFont.weights || '400').split(',').map(s=>s.trim()).filter(Boolean);
      let css = '';
      w.forEach(function(weight){ css += '@font-face{font-family:"'+FONT_NAME+'";font-style:normal;font-weight:'+weight+';src:url('+pendingFont.url+') format("'+pendingFont.format+'");}'; });
      css += 'body{font-family:"'+FONT_NAME+'", sans-serif;}';
      style.textContent = css;
      document.body.style.fontFamily = '"'+FONT_NAME+'", sans-serif';
      fontSelect.value = FONT_NAME;
    }
    if (fontRemove) fontRemove.addEventListener('click', function(){
      localStorage.removeItem(FONT_KEY);
      const st = document.getElementById('bumim-font-face'); if (st) st.remove();
      const sp = document.getElementById('bumim-font-preview'); if (sp) sp.remove();
      document.body.style.fontFamily = '';
      fontSelect.value = "'Space Grotesk', sans-serif";
      if (fontUploadStatus) fontUploadStatus.textContent = 'Uploaded font removed.';
      pendingFont = null;
    });
  }

  /* ============================ PANEL OPEN/CLOSE ============================ */
  toggleBtn.addEventListener('click', () => {
    panel.style.transform = 'translateX(0)';
    toggleBtn.style.display = 'none';
  });
  closeBtn.addEventListener('click', () => {
    panel.style.transform = 'translateX(-100%)';
    toggleBtn.style.display = 'flex';
  });

  /* ============================ TABS ============================ */
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

  /* ============================ COLOR ============================ */
  const applyAccentColor = (hex) => {
    document.documentElement.style.setProperty('--mint', hex);
    colorPicker.value = hex;
    colorText.value = hex;
    if (panelDot) panelDot.style.background = hex;
    if (toggleBtn) toggleBtn.style.color = hex;
    let styleTag = document.getElementById('comprehensive-accent-patch');
    if (!styleTag){
      styleTag = document.createElement('style');
      styleTag.id = 'comprehensive-accent-patch';
      document.head.appendChild(styleTag);
    }
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
      '#menu a:hover .m-t { color: ' + hex + ' !important; }' +
      '.pr-best { color: ' + hex + ' !important; }' +
      '.pr-who b { color: ' + hex + ' !important; }';
  };
  colorPicker.addEventListener('input', (e) => applyAccentColor(e.target.value));
  colorText.addEventListener('input', (e) => applyAccentColor(e.target.value));
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => applyAccentColor(btn.getAttribute('data-color')));
  });

  /* ============================ FONT FAMILY (select) ============================ */
  fontSelect.addEventListener('change', (e) => {
    if (e.target.value === FONT_NAME){ applyCustomFont(); }
    else { document.body.style.fontFamily = e.target.value; }
  });

  /* ============================ TYPOGRAPHY SLIDERS ============================ */
  heroSizeRange.addEventListener('input', (e) => {
    const val = e.target.value + 'px';
    heroSizeVal.textContent = val;
    document.querySelectorAll('#hero h1').forEach(h => h.style.fontSize = val);
  });
  secSizeRange.addEventListener('input', (e) => {
    const val = e.target.value + 'px';
    secSizeVal.textContent = val;
    document.querySelectorAll('section h2, section h3').forEach(h => h.style.fontSize = val);
  });

  /* ============================ APPLY & SAVE ============================ */
  applyBtn.addEventListener('click', () => {
    readEditorIntoCfg();
    readServicesEditorIntoCfg();
    savePricing(PRICING_CFG);
    renderPricing();
    const settings = { mint: colorPicker.value, font: fontSelect.value };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (fontSelect.value === FONT_NAME && pendingFont){
      localStorage.setItem(FONT_KEY, JSON.stringify({ url: pendingFont.url, format: pendingFont.format, weights: pendingFont.weights }));
      applyCustomFont();
    }
    try { localStorage.setItem(SECTIONS_KEY, JSON.stringify(savedSections)); } catch(e){}
    const toast = document.createElement('div');
    toast.textContent = '✓ Changes applied & saved successfully!';
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--mint, #f0a800);color:#050706;padding:12px 24px;border-radius:12px;font-weight:700;z-index:100000;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-size:14px;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  });

  /* ============================ RESET ============================ */
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(USD_RATE_KEY);
    localStorage.removeItem('bumim_ratios');
    localStorage.removeItem(PRICING_KEY);
    localStorage.removeItem(SECTIONS_KEY);
    localStorage.removeItem(FONT_KEY);
    location.reload();
  });

  /* ============================ LOG OUT ============================ */
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('bumim_admin');
    location.href = '/admin';
  });
});
</script>

` }} />
  );
}
