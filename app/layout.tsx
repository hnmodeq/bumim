import type { Metadata } from 'next';

const SITE = 'https://www.bumims.ir';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'بومیم | تولید محتوای دیجیتال',
  description:
    'Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies & shows. The ghost behind winning pitches — 150+ production houses, Germany & worldwide.',
  alternates: { canonical: SITE + '/' },
  openGraph: {
    type: 'website',
    siteName: 'Bumim',
    title: 'بومیم | تولید محتوای دیجیتال',
    description:
      'Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies & shows.',
    url: SITE + '/',
    images: [{ url: SITE + '/assets/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بومیم | تولید محتوای دیجیتال',
    description:
      'Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies & shows.',
    images: [SITE + '/assets/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Bumim',
  url: SITE + '/',
  image: SITE + '/assets/og-image.jpg',
  description:
    'Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies and shows.',
  areaServed: ['Germany', 'Worldwide'],
  knowsAbout: [
    "Director's treatments",
    'Pitch decks',
    'Mood research',
    'AI film and image generation',
    'Key visuals and title design',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
        <link rel="canonical" href={SITE + '/'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
/* self-hosted fonts — no third-party requests */
@font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:swap;
  src:url('/assets/fonts/instrument-serif-400.woff2') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:swap;
  src:url('/assets/fonts/instrument-serif-400-italic.woff2') format('woff2')}
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:300 700;font-display:swap;
  src:url('/assets/fonts/space-grotesk-var.woff2') format('woff2')}
:root{
  --void:#050706;
  --bone:#edf1ec;
  --mint:#f0a800;
  --teal:#00a8a8;
  --dim:#76827a;
  --line:rgba(237,241,236,.1);
  --tl-h:62px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{background:var(--void)}
body{
  background:var(--void);color:var(--bone);
  font-family:'Space Grotesk',system-ui,sans-serif;font-weight:300;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;
}
body.locked{overflow:hidden}
body.fine{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='4' fill='%23f0a800'/%3E%3C/svg%3E") 10 10, auto}
body.fine a,body.fine button,body.fine .seg{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='14' cy='14' r='12' fill='none' stroke='%23f0a800' stroke-width='1.5'/%3E%3Ccircle cx='14' cy='14' r='3.5' fill='%23f0a800'/%3E%3C/svg%3E") 14 14, pointer}
::selection{background:var(--mint);color:var(--void)}
.serif,em{font-family:'Instrument Serif',serif;font-weight:400;font-style:normal}
em{font-style:italic}
.eyebrow{font-size:12px;letter-spacing:.34em;text-transform:uppercase;color:var(--dim)}
a{color:inherit}

/* ---------- fixed layers ---------- */
/* soft-light leaves a black base untouched (0 stays 0) and only modulates
   what already carries light — grain sits on the highlights, blacks stay clean */
.grain{position:fixed;inset:-60px;z-index:12;pointer-events:none;opacity:.6;mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E");
  background-size:320px 320px;
  animation:grain 800ms steps(4) infinite}
@keyframes grain{0%{transform:translate(0,0)}25%{transform:translate(-20px,12px)}50%{transform:translate(12px,-18px)}75%{transform:translate(-8px,-8px)}100%{transform:translate(0,0)}}

/* ---------- autofocus pull: after the leader the whole frame racks from
   soft to sharp, with a short focus hunt — like a lens finding the scene ---------- */
.focus-pull{position:fixed;inset:0;z-index:35;pointer-events:none;
  backdrop-filter:blur(0);-webkit-backdrop-filter:blur(0)}
body.rolling .focus-pull{animation:focuspull 2.4s cubic-bezier(.3,.15,.25,1) .1s both}
@keyframes focuspull{
  0%{backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
  42%{backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
  58%{backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
  100%{backdrop-filter:blur(0);-webkit-backdrop-filter:blur(0)}
}

/* ---------- lens focus: content defocuses at the frame edges only ---------- */
.lens{position:fixed;left:0;right:0;z-index:30;pointer-events:none;
  backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
.lens-t{top:0;height:13vh;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 24%,transparent 100%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 24%,transparent 100%)}
.lens-b{bottom:0;height:15vh;
  -webkit-mask-image:linear-gradient(to top,#000 0%,#000 26%,transparent 100%);
  mask-image:linear-gradient(to top,#000 0%,#000 26%,transparent 100%)}

/* ---------- cursor: 100% hardware-rendered, zero lag ----------
   dot = default · dot in ring = links & buttons · play badge = spot cards */
body.fine .rw-card{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='13' fill='%23050706' fill-opacity='.55' stroke='%23f0a800' stroke-width='1.5'/%3E%3Cpath d='M13 10.5 L23 16 L13 21.5 Z' fill='%23f0a800'/%3E%3C/svg%3E") 16 16, pointer}

/* ---------- HUD (top) ---------- */
.hud{position:fixed;z-index:40;pointer-events:none;font-size:12px;letter-spacing:.24em;
  text-transform:uppercase;color:rgba(237,241,236,.78);transition:opacity .8s ease}
body.locked .hud{opacity:0}
.hud b{color:var(--bone);font-weight:400}
.hud-tl{top:28px;left:52px;display:flex;align-items:center;gap:10px}
.hud-tl .rec{width:8px;height:8px;border-radius:50%;background:#ff3b30;animation:blink 1.4s steps(1) infinite;transition:background .4s}
@keyframes blink{50%{opacity:.15}}
body.playing .hud-tl .rec{background:var(--teal);animation:none}
.hud-tr{top:28px;right:52px;display:flex;gap:26px;pointer-events:auto}
.hud-tr button{background:none;border:none;color:var(--mint);font:inherit;letter-spacing:inherit;
  text-transform:inherit;padding:0;border-bottom:1px solid rgba(240,168,0,.6);
  text-shadow:0 0 10px rgba(240,168,0,.6),0 0 26px rgba(240,168,0,.35);transition:text-shadow .3s}
.hud-tr button:hover{text-shadow:0 0 14px rgba(240,168,0,.95),0 0 34px rgba(240,168,0,.55)}
.corner{position:fixed;width:30px;height:30px;z-index:40;pointer-events:none;opacity:.8}
.corner::before,.corner::after{content:'';position:absolute;background:rgba(237,241,236,.85)}
.corner::before{width:100%;height:3px}
.corner::after{width:3px;height:100%}
.co-tl{top:16px;left:16px}.co-tr{top:16px;right:16px;transform:scaleX(-1)}
.co-bl{bottom:calc(var(--tl-h) + 16px);left:16px;transform:scaleY(-1)}
.co-br{bottom:calc(var(--tl-h) + 16px);right:16px;transform:scale(-1)}
.vf-tick{position:fixed;left:50%;transform:translateX(-50%);width:2px;height:9px;
  background:rgba(237,241,236,.45);z-index:40;pointer-events:none}
.vf-tick.t{top:16px}
.vf-tick.b{bottom:calc(var(--tl-h) + 16px)}

/* ---------- TIMELINE NAV (the edit bar) ---------- */
#tl{position:fixed;left:0;right:0;bottom:0;height:var(--tl-h);z-index:45;
  background:rgba(5,7,6,.88);backdrop-filter:blur(8px);border-top:1px solid var(--line);
  display:flex;align-items:stretch;transition:opacity .8s ease}
body.locked #tl{opacity:0}
#tl .tl-tc{display:flex;align-items:center;padding:0 22px;border-right:1px solid var(--line);
  font-size:13.5px;letter-spacing:.16em;color:var(--bone);font-variant-numeric:tabular-nums;white-space:nowrap}
#tl .tl-mid{position:relative;flex:1;display:flex;align-items:stretch}
#tl .tl-segs{position:absolute;inset:10px 0;display:flex;gap:2px}
#tl .seg{position:relative;background:rgba(237,241,236,.07);border:none;padding:0;min-width:6px;
  transition:background .3s}
#tl .seg:hover{background:rgba(237,241,236,.16)}
#tl .seg.on{background:rgba(240,168,0,.22)}
#tl .seg .sg-no{position:absolute;left:6px;top:50%;transform:translateY(-50%);
  font-size:10px;letter-spacing:.18em;color:var(--dim);pointer-events:none}
#tl .seg.on .sg-no{color:var(--mint)}
#tl .seg .sg-tip{position:absolute;left:0;bottom:calc(100% + 14px);white-space:nowrap;
  font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--bone);
  background:rgba(5,7,6,.92);border:1px solid var(--line);padding:7px 11px;
  opacity:0;transform:translateY(4px);transition:opacity .25s,transform .25s;pointer-events:none}
#tl .seg:hover .sg-tip{opacity:1;transform:none}
#tl .playhead{position:absolute;top:0;bottom:0;width:1px;background:var(--mint);pointer-events:none;z-index:2}
#tl .playhead::before{content:'';position:absolute;top:0;left:-4px;border:4.5px solid transparent;
  border-top-color:var(--mint)}
#tl .tl-sc{display:flex;flex-direction:column;justify-content:center;gap:2px;
  padding:0 22px;border-left:1px solid var(--line);text-align:right;white-space:nowrap}
#tl .tl-sc .no{font-size:11px;letter-spacing:.26em;color:var(--mint)}
#tl .tl-sc .nm{font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--bone)}

/* ---------- LEADER ---------- */
#leader{position:fixed;inset:0;z-index:70;background:var(--void);display:flex;
  align-items:center;justify-content:center;transition:opacity .5s ease}
#leader.gone{opacity:0;pointer-events:none}
.bar{position:fixed;left:0;right:0;height:12vh;background:#000;z-index:71;transition:transform 1s cubic-bezier(.7,0,.2,1) .1s}
.bar.top{top:0}.bar.bot{bottom:0}
body.rolling .bar.top{transform:translateY(-100%)}
body.rolling .bar.bot{transform:translateY(100%)}
.leader-x{position:absolute;background:rgba(237,241,236,.14)}
.leader-x.h{left:0;right:0;top:50%;height:1px}
.leader-x.v{top:0;bottom:0;left:50%;width:1px}
.leader-ring{position:relative;width:min(46vh,46vw);aspect-ratio:1;border:1px solid rgba(237,241,236,.3);
  border-radius:50%;display:flex;align-items:center;justify-content:center}
.leader-ring::before{content:'';position:absolute;inset:14%;border:1px solid rgba(237,241,236,.18);border-radius:50%}
.leader-sweep{position:absolute;inset:0;border-radius:50%}
#leader-num{font-family:'Instrument Serif',serif;font-size:min(24vh,24vw);line-height:1;color:var(--bone)}
.leader-cap{position:absolute;bottom:18vh;left:0;right:0;text-align:center;font-size:11.5px;
  letter-spacing:.5em;text-transform:uppercase;color:var(--dim)}
#leader.flick #leader-num{animation:flick .12s steps(2) 2}
@keyframes flick{50%{opacity:.2;transform:translateX(2px)}}

/* ---------- reveals ---------- */
/* ghost materialisation: chapter content forms out of a soft haze —
   stronger defocus, a slow settle, no bounce */
.reveal{opacity:0;filter:blur(24px);transform:translateY(30px) scale(.99);
  transition:opacity 1.4s cubic-bezier(.22,1,.3,1),filter 1.4s cubic-bezier(.22,1,.3,1),transform 1.4s cubic-bezier(.22,1,.3,1)}
.reveal.in{opacity:1;filter:blur(0);transform:none}
.rv{display:inline-block;opacity:0;filter:blur(18px);transform:translateY(.24em);
  transition:opacity 1.1s cubic-bezier(.22,1,.3,1),filter 1.1s cubic-bezier(.22,1,.3,1),transform 1.1s cubic-bezier(.22,1,.3,1)}
.in .rv{opacity:1;filter:blur(0);transform:none}
.gh{position:relative;display:inline-block}
.gh::before{content:attr(data-text);position:absolute;inset:0;color:var(--mint);
  filter:blur(14px);opacity:.28;animation:echo 7s ease-in-out infinite alternate;pointer-events:none}
@keyframes echo{from{transform:translate(-.02em,.015em) scale(1.002)}to{transform:translate(.025em,-.02em) scale(1.01)}}

/* ---------- slates ---------- */
.slate{margin:0 6vw;padding:16px 0 14px;border-top:1px solid var(--line);
  display:flex;align-items:baseline;gap:26px;position:relative}
.slate::before{content:'';position:absolute;top:-1px;left:0;width:120px;height:5px;
  background:repeating-linear-gradient(-45deg,var(--bone) 0 8px,transparent 8px 16px);opacity:.5}
.slate .sc{font-size:11.5px;letter-spacing:.3em;color:var(--mint)}
.slate .nm{font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--bone)}
.slate .tk{margin-left:auto;font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--dim)}
/* chapter entrance: stripe draws in, a mint scan sweeps the line,
   the scene number flickers on like a slate clap */
.slate::before{transform-origin:left;transform:scaleX(0);
  transition:transform .9s cubic-bezier(.22,1,.3,1) .2s}
.slate.in::before{transform:scaleX(1)}
.slate::after{content:'';position:absolute;top:-1px;left:0;height:1px;width:32%;max-width:240px;
  background:linear-gradient(90deg,var(--mint),transparent);opacity:0;pointer-events:none}
.slate.in::after{animation:slatescan 1.5s cubic-bezier(.3,.1,.25,1) .15s both}
@keyframes slatescan{0%{left:0;opacity:0}10%{opacity:.9}80%{opacity:.85}100%{left:76%;opacity:0}}
.slate .sc{opacity:0}
.slate.in .sc{animation:scflick .55s steps(3) .3s both}
@keyframes scflick{0%{opacity:0}40%{opacity:1}60%{opacity:.25}100%{opacity:1}}
.slate .nm,.slate .tk{opacity:0;transform:translateY(7px);
  transition:opacity .7s ease .4s,transform .7s cubic-bezier(.22,1,.3,1) .4s}
.slate.in .nm,.slate.in .tk{opacity:1;transform:none}

/* ---------- HERO ---------- */
#hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  padding:0 6vw;position:relative}
#hero .kicker{margin-bottom:30px}
/* brand lockup: the mark + Persian wordmark */
.lockup{display:flex;align-items:center;gap:20px;margin-bottom:28px}
.lockup-mark{display:block;height:clamp(58px,8vh,84px);width:auto}
.lockup-word{font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(34px,5.5vw,58px);
  line-height:1;color:var(--bone);letter-spacing:.02em;transform:translateY(-2px)}
.studio-line{display:flex;align-items:flex-start;gap:16px;font-size:12px;letter-spacing:.3em;
  text-transform:uppercase;color:var(--dim)}
.studio-line .studio-for{white-space:nowrap;line-height:1.6}
.studio-rot{position:relative;height:1.6em;overflow:hidden;flex:1;min-width:0}
.studio-rot span{position:absolute;left:0;top:0;line-height:1.6;white-space:nowrap;color:var(--mint);
  opacity:0;transform:translateY(130%);
  transition:transform .65s cubic-bezier(.22,1,.3,1),opacity .5s}
.studio-rot span.on{opacity:1;transform:none}
.studio-rot span.off{opacity:0;transform:translateY(-130%)}
#hero h1{font-family:'Instrument Serif',serif;font-weight:400;
  font-size:clamp(44px,7.5vw,132px);line-height:.96;letter-spacing:-.015em}
#hero h1 .l2 em{color:var(--mint)}
#hero .h-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:5vw;
  margin-top:6vh;flex-wrap:wrap}
#hero .h-sub{max-width:460px;color:#aab4ad;font-size:16px;line-height:1.85}
#hero .h-scroll{font-size:13.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--dim);
  display:flex;align-items:center;gap:12px}
#hero .h-scroll .ln{width:1px;height:44px;background:linear-gradient(var(--mint),transparent);
  animation:drop 2s ease infinite}
@keyframes drop{from{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1)}to{transform:scaleY(0);transform-origin:bottom}}

/* ---------- MANIFESTO ---------- */
#manifesto{padding:12vh 6vw 4vh}
#manifesto h2{font-family:'Instrument Serif',serif;font-weight:400;
  font-size:clamp(34px,5.4vw,86px);line-height:1.12}
#manifesto h2 .mute{color:var(--dim)}
#manifesto h2 em{color:var(--mint)}
#manifesto p{margin-top:5vh;max-width:580px;color:#aab4ad;font-size:16px;line-height:1.9}
#manifesto p b{color:var(--bone);font-weight:400}

/* ---------- FILMSTRIP (16:9 decks) ---------- */
#strip{height:400vh;position:relative}
#strip .pin{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;
  flex-direction:column;justify-content:center}
.track{display:flex;gap:4vw;padding:0 6vw;will-change:transform;align-items:center}
.fcard{flex:0 0 auto;width:min(700px,70vw);position:relative;text-decoration:none;color:var(--bone)}
.fcard .f-media{position:relative;overflow:hidden;border:1px solid var(--line);
  padding:24px 0;background:#000}
.fcard .f-media .inner{position:relative;aspect-ratio:16/9;overflow:hidden}
.fcard .f-media::before,.fcard .f-media::after{content:'';position:absolute;left:0;right:0;height:24px;
  background:repeating-linear-gradient(90deg,transparent 0 16px,rgba(237,241,236,.25) 16px 26px,transparent 26px 42px);
  background-size:42px 11px;background-repeat:repeat-x;background-position:center;z-index:2}
.fcard .f-media::before{top:0;border-bottom:1px solid var(--line)}
.fcard .f-media::after{bottom:0;border-top:1px solid var(--line)}
.fcard .f-no{position:absolute;top:36px;left:18px;z-index:3;font-family:'Instrument Serif',serif;
  font-style:italic;font-size:22px;color:rgba(237,241,236,.75)}
.fcard .inner > .ph-fill{transition:transform .8s cubic-bezier(.22,1,.3,1)}
.fcard:hover .inner > .ph-fill{transform:scale(1.05)}
.strip-end{flex:0 0 auto;width:44vw;display:flex;align-items:center}
.strip-end .se{font-family:'Instrument Serif',serif;font-size:clamp(30px,4.4vw,66px);line-height:1.06}
.strip-end .se em{color:var(--mint)}
.strip-prog{margin:26px 6vw 0;height:1px;background:var(--line);position:relative}
.strip-prog i{position:absolute;left:0;top:0;bottom:-1px;width:0;background:var(--mint);display:block}

/* ---------- placeholders ---------- */
.ph-fill{position:absolute;inset:0;overflow:hidden;background:#0a0f0d}
.ph-fill::before{content:'';position:absolute;inset:-40%;
  background:
    radial-gradient(50% 60% at 30% 35%, var(--c1,#0f3d2e) 0%, transparent 70%),
    radial-gradient(45% 55% at 72% 70%, var(--c2,#123528) 0%, transparent 70%),
    radial-gradient(70% 80% at 55% 45%, var(--c3,#071410) 0%, #050706 78%);
  animation:phdrift 15s ease-in-out infinite alternate}
.ph-fill::after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 110px 30px rgba(0,0,0,.55)}
@keyframes phdrift{from{transform:translate(-3%,-2%) scale(1)}to{transform:translate(3%,2%) scale(1.09) rotate(1.5deg)}}
.pal-mb{--c1:#123c31;--c2:#3a2f14}.pal-xm{--c1:#0e2f3c;--c2:#33230f}
.pal-mn{--c1:#12332a;--c2:#0a3d2c}.pal-fr{--c1:#33131f;--c2:#101c33}
.pal-fd{--c1:#12283a;--c2:#0f3a35}.pal-jg{--c1:#0e2c18;--c2:#2f2a10}
.pal-am{--c1:#2f2410;--c2:#101c33}.pal-sv{--c1:#22262c;--c2:#0f3a35}

/* ---------- REALISED (freeze-frame cards) ---------- */
#real{padding:6vh 0 4vh}
.real-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6vh 2.6vw;margin:6vh 6vw 0}
.rw-card{display:block;text-decoration:none;color:var(--bone)}
.rw-still{display:block;position:relative;aspect-ratio:16/9;overflow:hidden;
  border:1px solid var(--line);background:#000}
.rw-still img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.82;
  transition:transform .8s cubic-bezier(.22,1,.3,1),opacity .4s}
.rw-card:hover .rw-still img{transform:scale(1.05);opacity:1}
.rw-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:60px;height:60px;
  border-radius:50%;border:1px solid rgba(237,241,236,.55);background:rgba(5,7,6,.5);
  display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);
  transition:transform .35s cubic-bezier(.22,1,.3,1),border-color .35s,background .35s}
.rw-play::before{content:'';margin-left:5px;width:0;height:0;border-left:15px solid var(--bone);
  border-top:9px solid transparent;border-bottom:9px solid transparent;transition:border-color .35s}
.rw-card:hover .rw-play{transform:translate(-50%,-50%) scale(1.12);border-color:var(--teal);
  background:rgba(0,168,168,.16)}
.rw-card:hover .rw-play::before{border-left-color:var(--teal)}
.rw-meta{display:block;margin-top:16px}
.rw-no{display:block;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--dim);
  margin-bottom:8px}
.rw-t{display:block;font-family:'Instrument Serif',serif;font-size:clamp(21px,1.9vw,28px);line-height:1.12}
.laur{display:flex;align-items:flex-start;gap:10px;margin-top:10px;font-size:11px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--mint);line-height:1.75}
.laur::before{content:'';flex:0 0 16px;height:1px;background:rgba(240,168,0,.5);margin-top:.65em}

/* ---------- APPARITIONS ---------- */
#appar{padding:4vh 0 0}
#appar .ap-head{margin:8vh 6vw 0;max-width:1000px}
#appar .ap-head h2{font-family:'Instrument Serif',serif;font-weight:400;
  font-size:clamp(34px,5.4vw,86px);line-height:1.1}
#appar .ap-head h2 em{color:var(--mint)}
#appar .ap-head p{margin-top:3.5vh;max-width:580px;color:#aab4ad;font-size:16px;line-height:1.9}
.ap-stage{margin:7vh 6vw 0;position:relative}
.ap-rail{display:flex;gap:1.8vw;overflow-x:auto;padding-bottom:18px;
  scrollbar-width:thin;scrollbar-color:rgba(0,168,168,.55) rgba(237,241,236,.07)}
.ap-rail::-webkit-scrollbar{height:4px}
.ap-rail::-webkit-scrollbar-track{background:rgba(237,241,236,.07)}
.ap-rail::-webkit-scrollbar-thumb{background:rgba(0,168,168,.55)}
.ap-card{position:relative;flex:0 0 auto;height:min(46vh,430px);border:1px solid var(--line);
  overflow:hidden;background:#000}
.ap-card.wide{aspect-ratio:16/9}
.ap-card.tall{aspect-ratio:2/3}
.ap-card::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:repeating-linear-gradient(-45deg,transparent 0 22px,rgba(237,241,236,.05) 22px 23px)}
.nda{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:16px;text-align:center;padding:24px}
.nda-stamp{font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--teal);
  border:1px solid rgba(240,168,0,.55);box-shadow:0 0 0 3px rgba(240,168,0,.12);
  padding:10px 16px;transform:rotate(-3.5deg);white-space:nowrap}
.nda-t{font-family:'Instrument Serif',serif;font-size:clamp(22px,2.1vw,32px);line-height:1.15}
.nda-s{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim);
  max-width:36ch;line-height:1.9}
.ap-railhint{margin-top:14px;display:flex;align-items:center;gap:10px;font-size:11px;
  letter-spacing:.26em;text-transform:uppercase;color:var(--dim)}
.ap-railhint .tri{width:0;height:0;border-left:8px solid var(--teal);
  border-top:5px solid transparent;border-bottom:5px solid transparent}
.ap-note{margin:7vh 6vw 12vh;text-align:center;font-size:12px;letter-spacing:.3em;
  text-transform:uppercase;color:var(--dim)}
.ap-note b{color:var(--teal);font-weight:400}

/* ---------- SERVICES ---------- */
.svc-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:3vw;margin:4vh 0 0}
.svc{border-top:1px solid var(--line);padding-top:4.5vh}
.svc .s-i{font-family:'Instrument Serif',serif;font-style:italic;color:var(--mint);font-size:21px}
.svc h3{font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(20px,1.7vw,28px);
  margin:22px 0 16px;line-height:1.1}
.svc p{font-size:13.5px;line-height:1.8;color:#a2aca5}

/* ---------- AI collage ---------- */
#ai{padding:6vh 0 0}
#ai .ai-state{margin:6vh 6vw 0;max-width:1000px}
#ai .ai-state h2{font-family:'Instrument Serif',serif;font-weight:400;
  font-size:clamp(32px,5vw,78px);line-height:1.08}
#ai .ai-state h2 em{color:var(--mint)}
#ai .ai-state p{margin-top:3.5vh;max-width:560px;color:#aab4ad;font-size:16px;line-height:1.85}
/* masonry to the supplied reference: three columns of unequal width
   (wide / medium / narrow), each a vertical stack. clips keep their native
   ratio (nothing cropped); columns run out ragged at the bottom */
.collage{display:flex;align-items:flex-start;gap:14px;margin:8vh 6vw 0}
.cg-col{min-width:0;display:flex;flex-direction:column;gap:14px}
.cg-col.c1{flex:45 1 0}
.cg-col.c2{flex:30 1 0}
.cg-col.c3{flex:25 1 0}
.cg{position:relative;border:1px solid var(--line);overflow:hidden;aspect-ratio:var(--r)}

/* ---------- MARQUEE (JS-driven) ---------- */
.w-marquee{padding:10vh 0 2vh;overflow:hidden;white-space:nowrap}
.mq-in{display:inline-flex;will-change:transform}
.mq-in span{font-family:'Instrument Serif',serif;font-size:clamp(48px,7.5vw,130px);
  color:var(--mint);padding-right:.35em}

/* ---------- BRANDS grid ---------- */
.brands{margin:6vh 6vw 0;background:var(--line);display:grid;
  grid-template-columns:repeat(7,1fr);gap:1px;border:1px solid var(--line)}
.brand{background:var(--void);height:120px;display:flex;align-items:center;justify-content:center;
  font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--dim);
  transition:color .35s,background .35s}
.brand:hover{color:var(--mint);background:#070b09}
.brand img{height:72px;width:auto;opacity:.55;transition:opacity .35s,filter .35s}
.brand:hover img{opacity:1;filter:drop-shadow(0 0 6px rgba(240,168,0,.4))}
/* ---------- CREDITS ---------- */
#credits{padding:8vh 0 4vh;text-align:center}
#credits .cr-cap{margin-bottom:5vh}
.cr-roll{margin:0 auto;max-width:940px;padding:0 6vw}
.cr-roll .cr{display:flex;justify-content:space-between;align-items:baseline;gap:4vw;
  padding:2.2vh 0;border-bottom:1px solid var(--line)}
.cr-roll .cr .role{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--mint);text-align:left;white-space:nowrap}
.cr-roll .cr .who{font-family:'Instrument Serif',serif;font-size:clamp(17px,2.1vw,28px);text-align:right;line-height:1.35;color:var(--bone)}

/* ---------- END ---------- */
#end{display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:5vh;text-align:center;padding:10vh 6vw 4vh}
#end .cut{font-family:'Instrument Serif',serif;font-size:clamp(70px,15vw,240px);line-height:1}
#end .cut em{color:var(--mint)}
.end-slate{border:1px solid var(--line);min-width:min(560px,88vw)}
.end-slate .es-stripe{height:10px;background:repeating-linear-gradient(-45deg,var(--bone) 0 12px,var(--void) 12px 24px);opacity:.6}
.end-slate .es-row{display:flex;justify-content:space-between;gap:8vw;padding:16px 22px;
  border-top:1px solid var(--line);font-size:11.5px;letter-spacing:.28em;text-transform:uppercase}
.end-slate .es-row span:first-child{color:var(--dim)}
.end-cta{display:flex;gap:18px;flex-wrap:wrap;justify-content:center}
.end-cta a{font-size:12.5px;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;
  border:1px solid rgba(237,241,236,.25);padding:18px 32px;transition:border-color .35s,color .35s}
.end-cta a:hover{border-color:var(--mint);color:var(--mint)}
footer{display:flex;justify-content:space-between;padding:20px 6vw calc(var(--tl-h) + 34px);
  font-size:11.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim)}

/* ---------- LEGAL ---------- */
#legal{padding:4vh 6vw 6vh}
#legal .lg-cap{margin-bottom:4.5vh}
.legal-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4vh 4vw;
  border-top:1px solid var(--line);padding-top:5vh}
.legal-grid h4{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--mint);
  font-weight:400;margin-bottom:14px}
.legal-grid p{font-size:12.5px;line-height:1.85;color:#9aa49d}
.legal-grid a{color:var(--bone)}

/* ---------- MENU ---------- */
#menu{position:fixed;inset:0;z-index:60;background:rgba(5,7,6,.96);backdrop-filter:blur(10px);
  display:flex;flex-direction:column;justify-content:center;padding:0 8vw;
  opacity:0;pointer-events:none;transition:opacity .45s ease}
#menu.open{opacity:1;pointer-events:auto}
#menu a{display:flex;align-items:baseline;gap:3vw;text-decoration:none;color:var(--bone);
  padding:1.35vh 0;border-bottom:1px solid var(--line);
  opacity:0;transform:translateY(16px);filter:blur(8px);
  transition:opacity .5s ease,transform .5s cubic-bezier(.22,1,.3,1),filter .5s ease}
#menu.open a{opacity:1;transform:none;filter:blur(0)}
#menu a .m-sc{font-size:11.5px;letter-spacing:.3em;color:var(--mint);width:72px}
#menu a .m-t{font-family:'Instrument Serif',serif;font-size:clamp(24px,4vw,54px);line-height:1.05}
#menu a:hover .m-t{font-style:italic;color:var(--mint)}
#menu .m-close{position:absolute;top:24px;right:26px;background:none;border:none;color:var(--bone);
  font:inherit;font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;border-bottom:1px solid rgba(237,241,236,.3)}

@media (max-width:900px){
  /* viewfinder frame stays, just tighter and smaller so it reads as a frame
     instead of eating the screen */
  .corner{width:18px;height:18px}
  .corner::before{height:2px}
  .corner::after{width:2px}
  .co-tl{top:10px;left:10px}.co-tr{top:10px;right:10px}
  .co-bl{bottom:calc(var(--tl-h) + 10px);left:10px}
  .co-br{bottom:calc(var(--tl-h) + 10px);right:10px}
  /* the long REC caption collided with SCENES — drop the suffix, pull both in */
  .hud{font-size:10.5px;letter-spacing:.18em}
  .hud-sub{display:none}
  .hud-tl{top:18px;left:34px;gap:8px}
  .hud-tr{top:18px;right:34px;gap:18px}
  .hud-tr .fmt{display:none}
  #tl .tl-sc{display:none}
  #tl .seg .sg-no,#tl .seg .sg-tip{display:none}
  #strip{height:auto}
  #strip .pin{position:static;height:auto;overflow:visible}
  .track{overflow-x:auto;padding:0 6vw 3vh;scroll-snap-type:x mandatory}
  .fcard{scroll-snap-align:center;width:84vw}
  .strip-end{width:80vw}
  .strip-prog{display:none}
  .svc-grid{grid-template-columns:1fr;gap:4.5vh}
  .collage{display:block;columns:2;column-gap:10px}
  .cg-col{display:contents}
  .cg{width:100%;margin-bottom:10px;break-inside:avoid}
  .studio-line{flex-direction:column;gap:8px}
  /* flex:1 collapses to zero height in a column — the ticker was invisible */
  .studio-rot{flex:none;height:3.2em;width:100%}
  .studio-rot span{white-space:normal;line-height:1.6}
  .brands{grid-template-columns:repeat(2,1fr)}
  .ap-card{height:38vh}
  .real-grid{grid-template-columns:1fr;gap:6vh}
  .legal-grid{grid-template-columns:1fr;gap:4.5vh}

}
/* phones: the display type was set for desktop minimums and overwhelmed
   a 375px screen — scale the headline sizes to the viewport */
@media (max-width:600px){
  #hero{padding:0 7vw}
  #hero h1{font-size:clamp(29px,8.6vw,42px);line-height:1.02}
  #hero .h-sub{font-size:14.5px;line-height:1.75}
  #hero .h-scroll{font-size:11px;letter-spacing:.24em}
  .gp-logo{height:clamp(46px,13vw,60px);margin-bottom:22px}
  .lockup{gap:14px}
  .lockup-mark{height:clamp(46px,13vw,60px)}
  .lockup-word{font-size:clamp(28px,10vw,44px)}
  .studio-line{font-size:10.5px;letter-spacing:.22em}
  #manifesto{padding:9vh 7vw 3vh}
  #manifesto h2{font-size:clamp(24px,7vw,32px);line-height:1.16}
  #manifesto p,#appar .ap-head p,#ai .ai-state p{font-size:14.5px;line-height:1.8}
  #appar .ap-head h2,#ai .ai-state h2{font-size:clamp(24px,7vw,32px);line-height:1.14}
  #appar .ap-head{margin:6vh 7vw 0}
  .slate{margin:0 7vw}
  .slate .sc,.slate .nm,.slate .tk{font-size:10px;letter-spacing:.2em}
  .slate .tk{display:none}
  .eyebrow{font-size:10.5px;letter-spacing:.26em}
  .se{font-size:clamp(22px,6.4vw,30px)}
  .rw-t{font-size:19px}
  .laur{font-size:10px;letter-spacing:.1em}
  .mq-in span{font-size:clamp(34px,11vw,48px)}
  .cr-roll .cr{flex-direction:column;align-items:flex-start;gap:6px}
  .cr-roll .cr .who{text-align:left;font-size:17px}
  .cr-roll .cr .role{font-size:10.5px;letter-spacing:.22em}
  #end{padding:8vh 7vw 3vh;gap:4vh}
  #end .cut{font-size:clamp(52px,18vw,84px)}
  .end-slate{min-width:0;width:100%}
  .end-slate .es-row{padding:13px 16px;font-size:10.5px;letter-spacing:.2em;gap:4vw}
  .end-cta a{padding:15px 22px;font-size:11px;letter-spacing:.22em}
  .nda-t{font-size:19px}
  .nda-stamp{font-size:10px;letter-spacing:.22em;padding:8px 12px}
  .nda-s{font-size:10px;letter-spacing:.18em;line-height:1.7}
  .svc h3{font-size:19px}
  .svc p{font-size:13px}
  #legal{padding:3vh 7vw 5vh}
  .legal-grid p{font-size:12px}
  footer{font-size:10px;letter-spacing:.18em;gap:5vw;padding:18px 7vw calc(var(--tl-h) + 26px)}
  /* timeline: give the scene segments room and keep them off the right edge */
  #tl .tl-tc{padding:0 12px;font-size:11.5px;letter-spacing:.08em}
  /* margin, not padding — absolutely positioned children ignore padding,
     which would drift the playhead away from the segments */
  #tl .tl-mid{margin-right:12px}
  #tl .seg{min-width:10px}
}
@media (prefers-reduced-motion:reduce){
  .grain,.focus-pull,.slate .sc,.slate.in::after,.ph-fill::before,.gh::before,.h-scroll .ln,.hud-tl .rec{animation:none}
  .slate .sc,.slate .nm,.slate .tk{opacity:1;transform:none;transition:none}
  .slate::before{transform:none;transition:none}
  .reveal,.rv,#menu a{transition:none;opacity:1;filter:none;transform:none}
  #fx{display:none}
}
` }} />
      </head>
      <body className="locked" suppressHydrationWarning>{children}</body>
    </html>
  );
}
