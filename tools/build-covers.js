// Собирает обложки IPS-кейсов в assets/img/covers/*.jpg (1920×1080).
// Стиль повторяет обложки финтех-кейсов из Figma: светлый бетон, диагональный свет,
// устройство на поверхности и крупный тёмный заголовок справа.
// Запуск из корня репозитория: NODE_PATH=$(npm root -g) node tools/build-covers.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const img = (p) => 'file://' + path.join(root, 'assets/img', p);
const fonts = 'file://' + path.join(root, 'assets/fonts/fonts.css');

const W = 1920, H = 1080;

// Шум бетона: SVG-турбулентность в data URI
const noise = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
)}")`;
const blots = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 -.12'/></filter><rect width='100%' height='100%' filter='url(%23b)'/></svg>`
)}")`;

// Ноутбук анфас: экран с рамкой и алюминиевое основание
const laptop = (file, width, pos = 'top') => `
  <div class="laptop" style="width:${width}px">
    <div class="lid"><div class="cam"></div><div class="scr" style="background-image:url('${img(file)}');background-position:${pos}"></div></div>
    <div class="deck"><div class="notch"></div></div>
  </div>`;

// Планшет в портретной ориентации
const tablet = (file, width, height) => `
  <div class="tablet" style="width:${width}px;height:${height}px">
    <div class="scr" style="background-image:url('${img(file)}');background-position:top"></div>
  </div>`;

const base = (body, { beam = 110 } = {}) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${fonts}">
<style>
*{box-sizing:border-box;margin:0}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:"Onest",sans-serif;
  -webkit-font-smoothing:antialiased;background:#e2e2e0}
.wall{position:absolute;inset:0 0 24% 0;background:linear-gradient(180deg,#ebebe9,#dededc)}
.desk{position:absolute;inset:76% 0 0 0;background:linear-gradient(180deg,#cfcfcd 0,#e4e4e2 8%,#d8d8d6 100%)}
.desk::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,#e9e9e7,#b3b3b1)}
.tex{position:absolute;inset:0;background-image:${noise};opacity:.12;mix-blend-mode:multiply}
.blots{position:absolute;inset:0;background-image:${blots};opacity:.16;mix-blend-mode:multiply}
.light{position:absolute;inset:-20%;background:linear-gradient(${beam}deg,transparent 36%,rgba(255,255,255,.9) 40%,rgba(255,255,255,.85) 55%,transparent 59%);filter:blur(10px);mix-blend-mode:screen}
.shade{position:absolute;inset:-20%;background:linear-gradient(${beam}deg,rgba(60,60,60,.22) 0%,rgba(60,60,60,.12) 30%,transparent 36%,transparent 62%,rgba(60,60,60,.16) 70%,rgba(60,60,60,.2) 100%);filter:blur(12px)}
.title{position:absolute;right:70px;top:170px;z-index:5;color:#111;font-weight:500;font-size:112px;line-height:1.02;
  letter-spacing:-.015em;text-align:left}
.scene{position:absolute;z-index:3}
.laptop{position:relative}
.lid{position:relative;background:#0d0d0e;border-radius:26px 26px 6px 6px;padding:22px 22px 26px;
  box-shadow:inset 0 0 0 2px #3a3a3c,inset 0 0 0 4px #0d0d0e}
.cam{position:absolute;left:50%;top:0;width:150px;height:22px;margin-left:-75px;background:#0d0d0e;border-radius:0 0 10px 10px;z-index:2}
.scr{width:100%;aspect-ratio:1920/1002;border-radius:6px;background-size:100% auto;background-repeat:no-repeat;background-color:#fff}
.deck::after{content:"";position:absolute;left:3%;right:3%;bottom:-18px;height:22px;border-radius:50%;background:rgba(0,0,0,.45);filter:blur(10px);z-index:-1}
.deck{position:relative;height:34px;margin:0 -7%;border-radius:4px 4px 26px 26px;
  background:linear-gradient(180deg,#e7e7e9 0,#c3c3c6 30%,#9d9da1 70%,#77777b 100%);
  box-shadow:0 2px 0 #5f5f63}
.notch{position:absolute;left:50%;top:0;width:180px;height:10px;margin-left:-90px;border-radius:0 0 10px 10px;background:linear-gradient(180deg,#9b9b9f,#c9c9cc)}
.cast{position:absolute;z-index:2;background:rgba(30,30,30,.42);filter:blur(14px);border-radius:26px}
.tablet::after{content:"";position:absolute;left:6%;right:6%;bottom:-16px;height:20px;border-radius:50%;background:rgba(0,0,0,.4);filter:blur(10px);z-index:-1}
.tablet{position:relative;background:#0d0d0e;border-radius:44px;padding:22px;box-shadow:inset 0 0 0 3px #3a3a3c}
.tablet .scr{height:100%;aspect-ratio:auto;border-radius:24px;background-size:100% auto}
</style></head><body>
<div class="wall"></div><div class="desk"></div><div class="blots"></div><div class="shade"></div><div class="light"></div><div class="tex"></div>
${body}
</body></html>`;

const covers = {
  rakurs: base(`
    <div class="cast" style="left:250px;top:330px;width:1060px;height:600px;transform:skewX(-30deg) translateX(300px);opacity:.8"></div>
    <div class="scene" style="left:170px;top:300px">${laptop('rakurs-r1-main.jpg', 1060)}</div>
    <h1 class="title">Ракурс<br>2.0</h1>`),

  gantt: base(`
    <div class="cast" style="left:300px;top:380px;width:980px;height:560px;transform:skewX(-30deg) translateX(300px);opacity:.75"></div>
    <div class="scene" style="left:160px;top:320px;perspective:2200px">
      <div style="transform:rotateY(16deg) rotateX(3deg);transform-origin:left center">${laptop('gantt-error.jpg', 1040, 'left top')}</div>
    </div>
    <h1 class="title" style="font-size:96px;top:160px">Планирование<br>на диаграмме<br>Ганта</h1>`, { beam: 118 }),

  ds: base(`
    <div class="cast" style="left:420px;top:200px;width:520px;height:780px;transform:skewX(-28deg) translateX(260px);opacity:.75"></div>
    <div class="scene" style="left:330px;top:120px;perspective:2400px">
      <div style="transform:rotateY(-12deg) rotateZ(-2deg)">${tablet('ds-tokens-spec.jpg', 600, 860)}</div>
    </div>
    <h1 class="title" style="top:190px">Дизайн-<br>система<br>ИЦК</h1>`, { beam: 104 }),
};

// Обложки финтех-кейсов (bnpl.jpg, bank.jpg) экспортированы из Figma и этим скриптом не генерируются.

(async () => {
  const out = path.join(root, 'assets/img/covers');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  for (const [id, html] of Object.entries(covers)) {
    const tmp = path.join(out, `.${id}.html`);
    fs.writeFileSync(tmp, html);
    await p.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await p.screenshot({ path: path.join(out, `${id}.jpg`), type: 'jpeg', quality: 86 });
    fs.unlinkSync(tmp);
    console.log('cover', id);
  }
  await b.close();
})();
