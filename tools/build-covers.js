// Собирает обложки кейсов в assets/img/covers/*.jpg (1600×1000).
// Запуск из корня репозитория: NODE_PATH=$(npm root -g) node tools/build-covers.js
// Обложки финтех-кейсов используют PNG из assets/img/fintech/, если они есть.
// Без них собирается типографская обложка.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const img = (p) => 'file://' + path.join(root, 'assets/img', p);
const has = (p) => fs.existsSync(path.join(root, 'assets/img', p));
const fonts = 'file://' + path.join(root, 'assets/fonts/fonts.css');

const W = 1600, H = 1000;

// Фрагмент скриншота 1920×1002: x, y, w, h в пикселях исходника, scale — увеличение
const crop = (file, x, y, w, h, scale = 1) => `
  <div class="crop" style="width:${w * scale}px;height:${h * scale}px;
    background:url('${img(file)}') no-repeat;background-size:${1920 * scale}px auto;
    background-position:-${x * scale}px -${y * scale}px"></div>`;

const browser = (file, width) => `
  <div class="browser" style="width:${width}px">
    <div class="chrome"><i></i><i></i><i></i></div>
    <img src="${img(file)}">
  </div>`;

const phone = (file) => `<div class="phone"><img src="${img(file)}"></div>`;

const base = (bg, body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${fonts}">
<style>
*{box-sizing:border-box;margin:0}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:${bg};
  font-family:"Onest",sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.label{position:absolute;left:88px;top:80px;display:grid;gap:14px;max-width:760px;z-index:3}
.tag{font-family:"IBM Plex Mono",monospace;font-size:20px;letter-spacing:.08em;text-transform:uppercase;opacity:.72}
.title{font-size:58px;font-weight:700;line-height:1.08;letter-spacing:-.02em}
.sub{font-size:24px;line-height:1.4;opacity:.8;max-width:620px}
.browser{position:absolute;border-radius:16px;overflow:hidden;background:#fff;
  box-shadow:0 40px 90px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.15)}
.browser .chrome{height:34px;background:#eef0f4;display:flex;gap:8px;align-items:center;padding-left:16px}
.browser .chrome i{width:11px;height:11px;border-radius:50%;background:#c9ced8}
.browser img{display:block;width:100%}
.crop{border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.06);background-color:#fff}
.float{position:absolute;z-index:4}
.chip{position:absolute;z-index:4;background:rgba(255,255,255,.14);backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.28);border-radius:14px;padding:16px 20px;display:grid;gap:4px}
.chip b{font-size:40px;font-weight:700;letter-spacing:-.02em}
.chip span{font-size:18px;opacity:.85}
.code{font-family:"IBM Plex Mono",monospace;font-size:22px;background:rgba(10,6,30,.55);
  border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:10px 16px}
.phone{width:300px;height:620px;border-radius:44px;background:#0b0b0f;padding:12px;
  box-shadow:0 40px 90px rgba(0,0,0,.4)}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:34px;display:block}
.phones{position:absolute;right:90px;bottom:-70px;display:flex;gap:28px;align-items:flex-end}
.phones .phone:nth-child(2){transform:translateY(-60px)}
.glow{position:absolute;border-radius:50%;filter:blur(120px);opacity:.55}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:80px 80px;
  mask-image:linear-gradient(180deg,#000,transparent 80%)}
</style></head><body>${body}</body></html>`;

const label = (tag, title, sub) => `<div class="label"><p class="tag">${tag}</p>
  <h1 class="title">${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>`;

const covers = {
  rakurs: base('linear-gradient(135deg,#131a4a 0%,#2a3fb0 60%,#4d6cf0 100%)', `
    <div class="grid"></div><div class="glow" style="width:700px;height:700px;right:-200px;top:-200px;background:#7d9cff"></div>
    ${label('Enterprise · аналитика · план / факт / прогноз', 'Ракурс 2.0', 'Редизайн сводной таблицы план / факт на 1 000+ строк')}
    <div style="position:absolute;left:300px;top:430px">${browser('rakurs-r1-main.jpg', 1380)}</div>
    <div class="float" style="left:1110px;top:250px">${crop('rakurs-r2-inspector.jpg', 1546, 154, 358, 420, 1.15)}</div>
    <div class="float" style="left:150px;top:830px">${crop('rakurs-r2-inspector.jpg', 454, 872, 884, 42, 1.1)}</div>
    <div class="chip" style="left:88px;top:270px;display:flex;align-items:baseline;gap:14px"><b>−37&nbsp;%</b><span>интерфейса над таблицей</span></div>`),

  gantt: base('linear-gradient(135deg,#062c2a 0%,#0d5f58 55%,#18a08f 100%)', `
    <div class="grid"></div><div class="glow" style="width:640px;height:640px;left:-160px;bottom:-240px;background:#39d4bd"></div>
    ${label('Enterprise · сложное взаимодействие', 'Интерактивное планирование на диаграмме Ганта', 'Drag-and-drop операций между ресурсами с учётом зависимостей')}
    <div style="position:absolute;left:330px;top:420px">${browser('gantt-overview.jpg', 1360)}</div>
    <div class="float" style="left:760px;top:300px">${crop('gantt-error.jpg', 1282, 72, 622, 90, 1.25)}</div>
    <div class="float" style="left:110px;top:560px">${crop('gantt-error.jpg', 700, 268, 680, 410, 0.7)}</div>`),

  ds: base('linear-gradient(135deg,#1c0f45 0%,#4a2aa6 60%,#8a5cf5 100%)', `
    <div class="grid"></div><div class="glow" style="width:640px;height:640px;right:-120px;bottom:-200px;background:#c2a3ff"></div>
    ${label('Дизайн-система · токены · Figma → Storybook', 'Дизайн-система ИЦК', 'Спецификация токенов и процесс обновления компонентов')}
    <div class="browser" style="left:900px;top:120px;width:560px">
      <div class="chrome"><i></i><i></i><i></i></div>
      <div style="height:900px;background:url('${img('ds-tokens-spec.jpg')}') no-repeat top/100% auto"></div></div>
    <div class="float" style="left:88px;top:500px;display:grid;gap:18px">
      <p class="code" style="opacity:.55;text-decoration:line-through">--dropdown-padding-menu-horizont</p>
      <p class="code">--dropdown-menu-padding_h</p>
      <p class="code">--fild-border-color-hover</p>
    </div>
    <div class="chip" style="left:88px;top:790px"><b>95&nbsp;%</b><span>корпоративных систем на ДС · результат команды</span></div>`),
};

// Финтех-кейсы: телефоны или браузер, если PNG уже лежат в assets/img/fintech/
const fintech = [
  { id: 'bnpl', bg: 'linear-gradient(135deg,#3a0d1f 0%,#b3283c 55%,#ff7a45 100%)',
    tag: 'Финтех · mobile · BNPL', title: 'Сервис оплаты покупок частями',
    sub: 'Мобильное приложение: график платежей, история покупок, напоминания',
    phones: ['fintech/bnpl-1.png', 'fintech/bnpl-2.png', 'fintech/bnpl-3.png'] },
  { id: 'bank', bg: 'linear-gradient(135deg,#07142b 0%,#123a73 55%,#2f7de0 100%)',
    tag: 'Финтех · mobile и web · банкинг', title: 'Дистанционное банковское обслуживание',
    sub: 'Мобильный банк, интернет-банк и онлайн-кредитование',
    phones: ['fintech/bank-mobile-1.png', 'fintech/bank-mobile-2.png'], web: 'fintech/bank-web-1.png' },
];
for (const f of fintech) {
  const shots = f.phones.filter(has);
  let visual = '';
  if (f.web && has(f.web)) visual += `<div style="position:absolute;left:560px;top:430px">${browser(f.web, 1100)}</div>`;
  if (shots.length) visual += `<div class="phones">${shots.map(phone).join('')}</div>`;
  if (!visual) visual = `<div class="glow" style="width:820px;height:820px;right:-160px;bottom:-260px;background:rgba(255,255,255,.35)"></div>`;
  covers[f.id] = base(f.bg, `<div class="grid"></div>${label(f.tag, f.title, f.sub)}${visual}`);
}

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
