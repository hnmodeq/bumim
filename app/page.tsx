export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `TYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ghost Pitcher® — Treatment Design, Pitch Decks & AI Film</title>
<meta name="description" content="Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies & shows. The ghost behind winning pitches — 150+ production houses, Germany & worldwide.">
<link rel="canonical" href="https://www.ghost-pitcher.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Ghost Pitcher">
<meta property="og:title" content="Ghost Pitcher® — Treatment Design, Pitch Decks & AI Film">
<meta property="og:description" content="Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies & shows. The ghost behind winning pitches.">
<meta property="og:url" content="https://www.ghost-pitcher.com/">
<meta property="og:image" content="https://www.ghost-pitcher.com/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Ghost Pitcher® — Treatment Design, Pitch Decks & AI Film">
<meta name="twitter:description" content="Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies & shows.">
<meta name="twitter:image" content="https://www.ghost-pitcher.com/assets/og-image.jpg">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline'; connect-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Ghost Pitcher",
  "url": "https://www.ghost-pitcher.com/",
  "logo": "https://www.ghost-pitcher.com/assets/logo-ghost-pitcher.png",
  "image": "https://www.ghost-pitcher.com/assets/og-image.jpg",
  "description": "Treatment design, pitch decks, mood research and AI film for commercials, music videos, movies and shows.",
  "email": "hello@dar-dan.com",
  "telephone": "+49 176 84186946",
  "founder": {
    "@type": "Person",
    "name": "Dardan Sejdija",
    "jobTitle": "Art & Creative Director",
    "url": "https://www.dar-dan.com"
  },
  "sameAs": ["https://www.dar-dan.com"],
  "areaServed": ["Germany", "Worldwide"],
  "knowsAbout": ["Director's treatments", "Pitch decks", "Mood research", "AI film and image generation", "Key visuals and title design"]
}
</script>
<style>
/* self-hosted fonts — no third-party requests */
@font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:swap;
  src:url('assets/fonts/instrument-serif-400.woff2') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-display:swap;
  src:url('assets/fonts/instrument-serif-400-italic.woff2') format('woff2')}
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:300 700;font-display:swap;
  src:url('assets/fonts/space-grotesk-var.woff2') format('woff2')}
:root{
  --void:#050706;
  --bone:#edf1ec;
  --mint:#02df82;
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
body.fine{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='4' fill='%2302df82'/%3E%3C/svg%3E") 10 10, auto}
body.fine a,body.fine button,body.fine .seg{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='14' cy='14' r='12' fill='none' stroke='%2302df82' stroke-width='1.5'/%3E%3Ccircle cx='14' cy='14' r='3.5' fill='%2302df82'/%3E%3C/svg%3E") 14 14, pointer}
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
body.fine .rw-card{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='13' fill='%23050706' fill-opacity='.55' stroke='%2302df82' stroke-width='1.5'/%3E%3Cpath d='M13 10.5 L23 16 L13 21.5 Z' fill='%2302df82'/%3E%3C/svg%3E") 16 16, pointer}

/* ---------- HUD (top) ---------- */
.hud{position:fixed;z-index:40;pointer-events:none;font-size:12px;letter-spacing:.24em;
  text-transform:uppercase;color:rgba(237,241,236,.78);transition:opacity .8s ease}
body.locked .hud{opacity:0}
.hud b{color:var(--bone);font-weight:400}
.hud-tl{top:28px;left:52px;display:flex;align-items:center;gap:10px}
.hud-tl .rec{width:8px;height:8px;border-radius:50%;background:#ff3b30;animation:blink 1.4s steps(1) infinite;transition:background .4s}
@keyframes blink{50%{opacity:.15}}
body.playing .hud-tl .rec{background:var(--mint);animation:none}
.hud-tr{top:28px;right:52px;display:flex;gap:26px;pointer-events:auto}
.hud-tr button{background:none;border:none;color:var(--mint);font:inherit;letter-spacing:inherit;
  text-transform:inherit;padding:0;border-bottom:1px solid rgba(2,223,130,.6);
  text-shadow:0 0 10px rgba(2,223,130,.6),0 0 26px rgba(2,223,130,.35);transition:text-shadow .3s}
.hud-tr button:hover{text-shadow:0 0 14px rgba(2,223,130,.95),0 0 34px rgba(2,223,130,.55)}
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
#tl .seg.on{background:rgba(2,223,130,.22)}
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
.gp-logo{display:block;height:clamp(64px,9vh,92px);width:auto;margin-bottom:28px}
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
.rw-card:hover .rw-play{transform:translate(-50%,-50%) scale(1.12);border-color:var(--mint);
  background:rgba(2,223,130,.16)}
.rw-card:hover .rw-play::before{border-left-color:var(--mint)}
.rw-meta{display:block;margin-top:16px}
.rw-no{display:block;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--dim);
  margin-bottom:8px}
.rw-t{display:block;font-family:'Instrument Serif',serif;font-size:clamp(21px,1.9vw,28px);line-height:1.12}
.laur{display:flex;align-items:flex-start;gap:10px;margin-top:10px;font-size:11px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--mint);line-height:1.75}
.laur::before{content:'';flex:0 0 16px;height:1px;background:rgba(2,223,130,.5);margin-top:.65em}

/* ---------- APPARITIONS ---------- */
#appar{padding:4vh 0 0}
#appar .ap-head{margin:8vh 6vw 0;max-width:1000px}
#appar .ap-head h2{font-family:'Instrument Serif',serif;font-weight:400;
  font-size:clamp(34px,5.4vw,86px);line-height:1.1}
#appar .ap-head h2 em{color:var(--mint)}
#appar .ap-head p{margin-top:3.5vh;max-width:580px;color:#aab4ad;font-size:16px;line-height:1.9}
.ap-stage{margin:7vh 6vw 0;position:relative}
.ap-rail{display:flex;gap:1.8vw;overflow-x:auto;padding-bottom:18px;
  scrollbar-width:thin;scrollbar-color:rgba(2,223,130,.55) rgba(237,241,236,.07)}
.ap-rail::-webkit-scrollbar{height:4px}
.ap-rail::-webkit-scrollbar-track{background:rgba(237,241,236,.07)}
.ap-rail::-webkit-scrollbar-thumb{background:rgba(2,223,130,.55)}
.ap-card{position:relative;flex:0 0 auto;height:min(46vh,430px);border:1px solid var(--line);
  overflow:hidden;background:#000}
.ap-card.wide{aspect-ratio:16/9}
.ap-card.tall{aspect-ratio:2/3}
.ap-card::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:repeating-linear-gradient(-45deg,transparent 0 22px,rgba(237,241,236,.05) 22px 23px)}
.nda{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:16px;text-align:center;padding:24px}
.nda-stamp{font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--mint);
  border:1px solid rgba(2,223,130,.55);box-shadow:0 0 0 3px rgba(2,223,130,.12);
  padding:10px 16px;transform:rotate(-3.5deg);white-space:nowrap}
.nda-t{font-family:'Instrument Serif',serif;font-size:clamp(22px,2.1vw,32px);line-height:1.15}
.nda-s{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim);
  max-width:36ch;line-height:1.9}
.ap-railhint{margin-top:14px;display:flex;align-items:center;gap:10px;font-size:11px;
  letter-spacing:.26em;text-transform:uppercase;color:var(--dim)}
.ap-railhint .tri{width:0;height:0;border-left:8px solid var(--mint);
  border-top:5px solid transparent;border-bottom:5px solid transparent}
.ap-note{margin:7vh 6vw 12vh;text-align:center;font-size:12px;letter-spacing:.3em;
  text-transform:uppercase;color:var(--dim)}
.ap-note b{color:var(--mint);font-weight:400}

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
.brand:hover img{opacity:1;filter:drop-shadow(0 0 6px rgba(2,223,130,.4))}
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
</style>
</head>
<body class="locked">

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
  <div class="leader-cap">Ghost Pitcher — Picture Start</div>
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
    <img class="gp-logo" src="/assets/logo-ghost-pitcher.png" alt="Ghost Pitcher®">
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
      companies, producers and directors book us as their Ghost Pitcher. Ghost Pitcher is the invisible
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
    <div class="es-row"><span>Studio</span><span>Ghost Pitcher®</span></div>
    <div class="es-row"><span>Take</span><span>01</span></div>
  </div>
  <div class="end-cta reveal">
    <a href="mailto:hello@dar-dan.com">hello@dar-dan.com</a>
    <a href="tel:+4917684186946">+49 176 84 186 946</a>
    <a href="https://www.dar-dan.com" target="_blank" rel="noopener noreferrer">dar-dan.com</a>
  </div>
</section>
<!-- ============ LEGAL ============ -->
<section id="legal">
  <p class="eyebrow lg-cap reveal">Fine print — Legal &amp; privacy</p>
  <div class="legal-grid reveal">
    <div class="lg">
      <h4>Imprint</h4>
      <p>Ghost Pitcher® is the treatment &amp; AI studio of Dardan Sejdija — Art &amp; Creative Director
      (owner). Main portfolio: <a href="https://www.dar-dan.com" target="_blank" rel="noopener noreferrer">www.dar-dan.com</a> ·
      Contact: <a href="mailto:hello@dar-dan.com">hello@dar-dan.com</a> · +49&nbsp;176&nbsp;84&nbsp;186&nbsp;946.</p>
    </div>
    <div class="lg">
      <h4>Copyright</h4>
      <p>© 2026 Ghost Pitcher®. All rights reserved. All treatments, pitch decks, concept frames,
      title designs, key art and other materials shown on this site are the intellectual property
      of Ghost Pitcher and/or the respective clients and rights holders. Reproduction, distribution
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
      You may request deletion of your correspondence at any time:
      <a href="mailto:hello@dar-dan.com">hello@dar-dan.com</a>.</p>
    </div>
  </div>
</section>
<footer><span>© Ghost Pitcher® 2026 — All rights reserved</span><span>Prototype IV — The Ghost Cam</span></footer>

<!-- Vercel Web Analytics — cookieless page views. The script is served by
     Vercel itself at /_vercel/insights/script.js, so no third-party host. -->
<script>window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };</script>
<script defer src="/_vercel/insights/script.js"></script>

<script>
/* =========================================================
   GHOST PITCHER — Prototype IV
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
  sweep.style.background = \`conic-gradient(rgba(2,223,130,.16) \${frac*360}deg, transparent \${frac*360}deg)\`;
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
      <div id="panel-dot" style="width:10px;height:10px;border-radius:50%;background:var(--mint, #02df82);"></div>
      <span style="font-weight:700;font-size:15px;letter-spacing:0.05em;">LIVE CONTROL PANEL</span>
    </div>
    <button id="panel-close" style="background:none;border:none;color:#edf1ec;font-size:18px;cursor:pointer;padding:4px 8px;">✕</button>
  </div>
  
  <div style="display:flex;border-bottom:1px solid rgba(237,241,236,0.1);background:rgba(0,0,0,0.2);">
    <button class="panel-tab active" data-tab="tab-colors" style="flex:1;padding:12px 6px;background:none;border:none;color:#edf1ec;font-size:11px;font-weight:600;cursor:pointer;border-bottom:2px solid var(--mint, #02df82);">Colors</button>
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
          <input type="color" id="accent-color-picker" value="#02df82" style="width:40px;height:40px;border:none;border-radius:8px;cursor:pointer;background:none;" />
          <input type="text" id="accent-color-text" value="#02df82" style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:8px 12px;border-radius:8px;font-family:monospace;font-size:13px;" />
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;margin-bottom:6px;">Quick Presets</label>
        <div style="display:flex;gap:8px;">
          <button class="palette-btn" data-color="#02df82" style="width:32px;height:32px;border-radius:50%;background:#02df82;border:none;cursor:pointer;" title="Mint"></button>
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
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="hero" checked style="accent-color:var(--mint, #02df82);" /> Hero Section</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="manifesto" checked style="accent-color:var(--mint, #02df82);" /> Manifesto (The Unseen Author)</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="strip" checked style="accent-color:var(--mint, #02df82);" /> Selected Treatments</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="real" checked style="accent-color:var(--mint, #02df82);" /> Campaigns</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="ai" checked style="accent-color:var(--mint, #02df82);" /> AI in the Pipeline</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="appar" checked style="accent-color:var(--mint, #02df82);" /> Apparitions</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="credits" checked style="accent-color:var(--mint, #02df82);" /> Credits & Logos</label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;"><input type="checkbox" data-section="end" checked style="accent-color:var(--mint, #02df82);" /> Brief / Contact</label>
      </div>
    </div>

    <!-- TAB 4: TYPOGRAPHY TOKENS -->
    <div id="tab-typography" class="panel-content" style="display:none;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#76827a;margin-bottom:12px;">Typography Tokens</h3>
      <div style="margin-bottom:14px;">
        <label style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;"><span>Hero Title Size</span><span id="val-hero-size">72px</span></label>
        <input type="range" id="token-hero-size" min="40" max="120" value="72" style="width:100%;accent-color:var(--mint, #02df82);" />
      </div>
      <div style="margin-bottom:14px;">
        <label style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;"><span>Section Title Size</span><span id="val-sec-size">48px</span></label>
        <input type="range" id="token-sec-size" min="24" max="80" value="48" style="width:100%;accent-color:var(--mint, #02df82);" />
      </div>
    </div>
  </div>

  <div style="padding:16px 20px;border-top:1px solid rgba(237,241,236,0.1);background:rgba(0,0,0,0.3);display:flex;gap:10px;">
    <button id="panel-apply" style="flex:1;background:var(--mint, #02df82);color:#050706;border:none;padding:12px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">Apply & Save</button>
    <button id="panel-reset" style="background:rgba(255,255,255,0.08);color:#edf1ec;border:none;padding:12px 14px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;">Reset</button>
  </div>
</div>

<button id="panel-toggle" style="position:fixed;top:50%;left:0;transform:translateY(-50%);width:36px;height:48px;background:#0d110f;color:var(--mint, #02df82);border:1px solid rgba(237,241,236,0.2);border-left:none;border-radius:0 8px 8px 0;z-index:9998;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:4px 0 15px rgba(0,0,0,0.5);" title="Open Live Control Panel">⚙️</button>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('admin-panel');
  const toggleBtn = document.getElementById('panel-toggle');
  const closeBtn = document.getElementById('panel-close');
  const applyBtn = document.getElementById('panel-apply');
  const resetBtn = document.getElementById('panel-reset');
  const colorPicker = document.getElementById('accent-color-picker');
  const colorText = document.getElementById('accent-color-text');
  const fontSelect = document.getElementById('font-family-select');
  const heroSizeRange = document.getElementById('token-hero-size');
  const heroSizeVal = document.getElementById('val-hero-size');
  const secSizeRange = document.getElementById('token-sec-size');
  const secSizeVal = document.getElementById('val-sec-size');
  const panelDot = document.getElementById('panel-dot');

  // Load saved settings
  const saved = JSON.parse(localStorage.getItem('ghost_pitcher_admin') || '{}');
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
      tab.style.borderBottom = '2px solid var(--mint, #02df82)';
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
    styleTag.textContent = 
      "body.fine { cursor: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='4' fill='%23" + cleanHex + "'/%3E%3C/svg%3E\") 10 10, auto; }" +
      "body.fine a, body.fine button, body.fine .seg { cursor: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='14' cy='14' r='12' fill='none' stroke='%23" + cleanHex + "' stroke-width='1.5'/%3E%3Ccircle cx='14' cy='14' r='3.5' fill='%23" + cleanHex + "'/%3E%3C/svg%3E\") 14 14, pointer; }" +
      "body.fine .rw-card { cursor: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='13' fill='%23050706' fill-opacity='.55' stroke='%23" + cleanHex + "' stroke-width='1.5'/%3E%3Cpath d='M13 10.5 L23 16 L13 21.5 Z' fill='%23" + cleanHex + "'/%3E%3C/svg%3E\") 16 16, pointer; }" +
      "::selection { background: " + hex + " !important; color: #050706 !important; }" +
      ".ap-rail::-webkit-scrollbar-thumb { background: " + hex + " !important; }" +
      "#tl { border-top-color: " + hex + "33 !important; }" +
      "body.playing .hud-tl .rec { background: " + hex + " !important; }" +
      ".hud-tr button { color: " + hex + " !important; border-bottom-color: " + hex + "99 !important; }" +
      ".hud-tr button:hover { text-shadow: 0 0 14px " + hex + ", 0 0 34px " + hex + "88 !important; }" +
      "#tl .seg.on { background: " + hex + "3b !important; }" +
      "#tl .seg.on .sg-no { color: " + hex + " !important; }" +
      "#tl .playhead { background: " + hex + " !important; }" +
      "#tl .playhead::before { border-top-color: " + hex + " !important; }" +
      "#tl .tl-sc .no { color: " + hex + " !important; }" +
      ".gh::before { color: " + hex + " !important; }" +
      ".slate .sc { color: " + hex + " !important; }" +
      ".studio-rot span { color: " + hex + " !important; }" +
      "#hero h1 .l2 em { color: " + hex + " !important; }" +
      "#hero .h-scroll .ln { background: linear-gradient(" + hex + ", transparent) !important; }" +
      "#manifesto h2 em { color: " + hex + " !important; }" +
      ".strip-end .se em { color: " + hex + " !important; }" +
      ".strip-prog i { background: " + hex + " !important; }" +
      ".rw-card:hover .rw-play { border-color: " + hex + " !important; }" +
      ".rw-card:hover .rw-play::before { border-left-color: " + hex + " !important; }" +
      "#appar .ap-head h2 em { color: " + hex + " !important; }" +
      ".nda-stamp { color: " + hex + " !important; }" +
      ".ap-railhint .tri { border-left-color: " + hex + " !important; }" +
      ".ap-note b { color: " + hex + " !important; }" +
      ".svc .s-i { color: " + hex + " !important; }" +
      "#ai .ai-state h2 em { color: " + hex + " !important; }" +
      ".brand:hover { color: " + hex + " !important; border-color: " + hex + " !important; }" +
      ".cr-roll .cr .role { color: " + hex + " !important; }" +
      "#end .cut em { color: " + hex + " !important; }" +
      ".end-cta a:hover { border-color: " + hex + " !important; color: " + hex + " !important; }" +
      ".legal-grid h4 { color: " + hex + " !important; }" +
      "#menu a .m-sc { color: " + hex + " !important; }" +
      "#menu a:hover .m-t { color: " + hex + " !important; }";
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
    localStorage.setItem('ghost_pitcher_admin', JSON.stringify(settings));
    
    // Success toast notification
    const toast = document.createElement('div');
    toast.textContent = '✓ Changes applied & saved successfully!';
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--mint, #02df82);color:#050706;padding:12px 24px;border-radius:12px;font-weight:700;z-index:100000;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-size:14px;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('ghost_pitcher_admin');
    location.reload();
  });
});
</script>
` }} />
  );
}
/* touch for sync */
