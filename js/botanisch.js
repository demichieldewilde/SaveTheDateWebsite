/*
 * Tekent de bloemen, aren en grassen als SVG.
 * De kleuren komen uit de CSS (per stijl), zodat dezelfde tekening
 * als lijntekening of als ingekleurde illustratie kan verschijnen.
 */
window.Botanisch = (() => {
  "use strict";

  const r1 = (n) => Math.round(n * 10) / 10;
  const rad = (g) => (g * Math.PI) / 180;

  function maakRng(seed) {
    let s = (seed * 9301 + 49297) % 233280 || 1;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  // punt + richting op een kubische bezier
  function bez(p, t) {
    const u = 1 - t;
    const as = (i) =>
      u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i];
    const af = (i) =>
      3 * u * u * (p[1][i] - p[0][i]) + 6 * u * t * (p[2][i] - p[1][i]) + 3 * t * t * (p[3][i] - p[2][i]);
    return { x: as(0), y: as(1), hoek: (Math.atan2(af(1), af(0)) * 180) / Math.PI };
  }

  const pad = (p) =>
    `M${r1(p[0][0])} ${r1(p[0][1])}C${r1(p[1][0])} ${r1(p[1][1])} ${r1(p[2][0])} ${r1(p[2][1])} ${r1(p[3][0])} ${r1(p[3][1])}`;

  /* ---------- onderdelen ---------- */

  function blad(x, y, hoek, len, br) {
    return (
      `<g class="blad" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek)})">` +
      `<path class="vlak" d="M0 0C${r1(len * 0.25)} ${r1(-br)} ${r1(len * 0.7)} ${r1(-br * 0.95)} ${r1(len)} 0` +
      `C${r1(len * 0.7)} ${r1(br * 0.95)} ${r1(len * 0.25)} ${r1(br)} 0 0Z"/>` +
      `<path class="nerf" d="M${r1(len * 0.1)} 0Q${r1(len * 0.5)} ${r1(-br * 0.15)} ${r1(len * 0.86)} 0"/></g>`
    );
  }

  // zijaanzicht, wijst in de richting 'hoek'; (x, y) is het punt waar de steel eindigt
  function korenbloem(x, y, r, hoek, alt) {
    const kroonblad =
      `M0 0L${r1(-r * 0.1)} ${r1(-r * 0.62)}L${r1(-r * 0.27)} ${r1(-r * 0.95)}L${r1(-r * 0.09)} ${r1(-r * 0.85)}` +
      `L0 ${r1(-r)}L${r1(r * 0.09)} ${r1(-r * 0.85)}L${r1(r * 0.27)} ${r1(-r * 0.95)}L${r1(r * 0.1)} ${r1(-r * 0.62)}Z`;
    let s = `<g class="korenbloem${alt ? " alt" : ""}" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek + 90)})"><g transform="translate(0 ${r1(-r * 0.75)})">`;
    for (let i = 0; i < 9; i++) s += `<path class="kroon" transform="rotate(${-76 + i * 19})" d="${kroonblad}"/>`;
    s +=
      `<path class="kelk" d="M${r1(-r * 0.3)} 0C${r1(-r * 0.38)} ${r1(r * 0.5)} ${r1(-r * 0.12)} ${r1(r * 0.75)} 0 ${r1(r * 0.75)}` +
      `C${r1(r * 0.12)} ${r1(r * 0.75)} ${r1(r * 0.38)} ${r1(r * 0.5)} ${r1(r * 0.3)} 0Z"/>` +
      `<path class="kelk-lijn" d="M${r1(-r * 0.22)} ${r1(r * 0.22)}L${r1(r * 0.22)} ${r1(r * 0.22)}M${r1(-r * 0.16)} ${r1(r * 0.45)}L${r1(r * 0.16)} ${r1(r * 0.45)}"/>`;
    return s + "</g></g>";
  }

  // licht gekanteld vooraanzicht
  function madeliefje(x, y, r, hoek) {
    let s = `<g class="madeliefje" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek + 90)}) translate(0 ${r1(-r * 0.35)}) scale(1 .62)">`;
    for (let i = 0; i < 16; i++) {
      s += `<ellipse class="p" transform="rotate(${i * 22.5})" cy="${r1(-r * 0.58)}" rx="${r1(r * 0.13)}" ry="${r1(r * 0.42)}"/>`;
    }
    return s + `<circle class="hart" r="${r1(r * 0.27)}"/></g>`;
  }

  function aar(x, y, len, hoek) {
    const w = len * 0.16;
    let s = `<g class="aar" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek + 90)})">`;
    s += `<path class="steel" d="M0 0L0 ${r1(-len)}"/>`;
    const n = 7;
    for (let i = 0; i < n; i++) {
      const yy = -len * (0.12 + (0.8 * i) / n);
      for (const kant of [-1, 1]) {
        const kx = kant * w * 0.5;
        s +=
          `<ellipse class="korrel" transform="translate(${r1(kx)} ${r1(yy)}) rotate(${kant * 24})" rx="${r1(w * 0.36)}" ry="${r1(w * 0.78)}"/>` +
          `<path class="baard" d="M${r1(kx + kant * w * 0.2)} ${r1(yy - w * 0.6)}L${r1(kx + kant * w * 1.1)} ${r1(yy - w * 3)}"/>`;
      }
    }
    s += `<ellipse class="korrel" cy="${r1(-len * 0.97)}" rx="${r1(w * 0.32)}" ry="${r1(w * 0.7)}"/>`;
    return s + "</g>";
  }

  /* ---------- een takje: steel + blaadjes + bloem ---------- */

  function takje(x, y, hoek, len, soort, rng, opties = {}) {
    const dir = [Math.cos(rad(hoek)), Math.sin(rad(hoek))];
    const loodrecht = [-dir[1], dir[0]];
    const buig = opties.buig ?? (rng() - 0.5) * 0.5;
    const pt = (a, b) => [x + dir[0] * len * a + loodrecht[0] * len * b, y + dir[1] * len * a + loodrecht[1] * len * b];
    const p = [[x, y], pt(0.4, buig * 0.3), pt(0.75, buig * 0.45), pt(1, buig * 0.35)];

    let s = `<path class="steel" d="${pad(p)}"/>`;
    const aantal = opties.bladeren ?? (soort === "blad" ? 9 : 3 + Math.floor(rng() * 3));
    for (let i = 0; i < aantal; i++) {
      const t = soort === "blad" ? 0.1 + (0.85 * i) / aantal : 0.15 + (0.6 * i) / aantal;
      const b = bez(p, t);
      const kant = i % 2 ? 1 : -1;
      const l = len * (soort === "blad" ? 0.2 : 0.17) * (1 - t * 0.35) * (0.85 + rng() * 0.3);
      s += blad(b.x, b.y, b.hoek + kant * (38 + rng() * 18), l, l * 0.3);
    }
    const top = bez(p, 1);
    const r = opties.r ?? len * 0.11;
    if (soort === "korenbloem") s += korenbloem(top.x, top.y, r, top.hoek, opties.alt);
    if (soort === "madeliefje") s += madeliefje(top.x, top.y, r, top.hoek);
    if (soort === "aar") s += aar(top.x, top.y, len * 0.32, top.hoek);
    if (soort === "blad") s += blad(top.x, top.y, top.hoek, len * 0.14, len * 0.04);
    return s;
  }

  const svg = (klasse, viewBox, inhoud, aspect = "xMidYMid meet") =>
    `<svg class="bot ${klasse}" viewBox="${viewBox}" preserveAspectRatio="${aspect}" aria-hidden="true" focusable="false">${inhoud}</svg>`;

  /* ---------- composities ---------- */

  // twee sobere stengels (korenbloem + aar), voor vragen zonder foto
  function stengels(seed = 1) {
    const rng = maakRng(seed);
    let s = "";
    s += takje(150, 470, -97, 360, "aar", rng, { buig: -0.08, bladeren: 2 });
    s += takje(150, 470, -84, 330, "korenbloem", rng, { buig: 0.1, bladeren: 4, r: 30 });
    return svg("bot-stengels", "0 0 300 480", s);
  }

  // kransje: twee takjes die onderaan samenkomen
  function krans(seed = 1) {
    const rng = maakRng(seed);
    const kant = () => {
      const p = [[150, 52], [118, 66], [62, 64], [14, 30]];
      let s = `<path class="steel" d="${pad(p)}"/>`;
      for (let i = 0; i < 9; i++) {
        const t = 0.08 + i * 0.105;
        const b = bez(p, t);
        const l = 17 - t * 6;
        s += blad(b.x, b.y, b.hoek + (i % 2 ? 42 : -42), l, l * 0.32);
      }
      const top = bez(p, 1);
      return s + blad(top.x, top.y, top.hoek, 12, 3.6);
    };
    let s = kant() + `<g transform="translate(320 0) scale(-1 1)">${kant()}</g>`;
    s += madeliefje(160, 56, 11 + rng(), -90);
    return svg("bot-krans", "0 0 320 80", s);
  }

  /* ---------- sierrand rond een foto: bloemenranken + kompassen ---------- */

  // blauwe bloem met vijf brede, licht gepunte blaadjes en nerven
  function sterbloem(x, y, r, hoek) {
    const kb =
      `M0 0C${r1(r * 0.5)} ${r1(-r * 0.2)} ${r1(r * 0.48)} ${r1(-r * 0.78)} 0 ${r1(-r)}` +
      `C${r1(-r * 0.48)} ${r1(-r * 0.78)} ${r1(-r * 0.5)} ${r1(-r * 0.2)} 0 0Z`;
    const nerf =
      `M0 ${r1(-r * 0.12)}L0 ${r1(-r * 0.8)}` +
      `M0 ${r1(-r * 0.3)}Q${r1(r * 0.14)} ${r1(-r * 0.5)} ${r1(r * 0.22)} ${r1(-r * 0.66)}` +
      `M0 ${r1(-r * 0.3)}Q${r1(-r * 0.14)} ${r1(-r * 0.5)} ${r1(-r * 0.22)} ${r1(-r * 0.66)}`;
    let s = `<g class="sterbloem" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek)})">`;
    for (let i = 0; i < 5; i++) s += `<g transform="rotate(${i * 72})"><path class="kb" d="${kb}"/><path class="nerf" d="${nerf}"/></g>`;
    return s + `<circle class="hart" r="${r1(r * 0.12)}"/></g>`;
  }

  // geel bloemetje met acht ronde blaadjes en een paars hartje
  function geelbloem(x, y, r, hoek = 0) {
    let s = `<g class="geelbloem" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek)})">`;
    for (let i = 0; i < 8; i++) s += `<ellipse class="p" transform="rotate(${i * 45})" cy="${r1(-r * 0.56)}" rx="${r1(r * 0.27)}" ry="${r1(r * 0.44)}"/>`;
    return s + `<circle class="hart" r="${r1(r * 0.3)}"/></g>`;
  }

  // krulletje dat uit de rank groeit
  const krul = (x, y, hoek, k = 1, spiegel = false) =>
    `<path class="krul" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek)}) scale(${k} ${spiegel ? -k : k})" d="M0 0C3 -8 10 -14 18 -13C25 -12 26 -4 21 -1C17 1 14 -3 17 -5"/>`;

  const sierblad = (x, y, hoek, l) =>
    `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek)})">` +
    `<path class="sierblad" d="M0 0C${r1(l * 0.28)} ${r1(-l * 0.36)} ${r1(l * 0.72)} ${r1(-l * 0.34)} ${r1(l)} 0C${r1(l * 0.72)} ${r1(l * 0.34)} ${r1(l * 0.28)} ${r1(l * 0.36)} 0 0Z"/>` +
    `<path class="sierblad-nerf" d="M${r1(l * 0.15)} 0L${r1(l * 0.8)} 0"/></g>`;

  // rank rond de rechterbovenhoek (viewBox 0 0 240 240; de foto ligt links-onder van de rank)
  function rank(seed) {
    const rng = maakRng(seed);
    const A = [[8, 46], [52, 14], [150, 4], [196, 42]];
    const B = [[196, 42], [222, 70], [216, 160], [190, 234]];
    let s = "";
    const op = (p, t, d = 0) => {
      const b = bez(p, t);
      const n = rad(b.hoek - 90); // naar buiten (boven / rechts)
      return { x: b.x + Math.cos(n) * d, y: b.y + Math.sin(n) * d, hoek: b.hoek };
    };
    // stipjes eerst, zodat ze achter alles liggen
    for (const p of [A, B]) {
      for (let i = 0; i < 11; i++) {
        const q = op(p, 0.04 + i * 0.09 + rng() * 0.03, (i % 2 ? -1 : 1) * (11 + rng() * 9));
        s += `<circle class="${rng() < 0.8 ? "stip" : "stip-blauw"}" cx="${r1(q.x)}" cy="${r1(q.y)}" r="${r1(1.7 + rng() * 1.1)}"/>`;
      }
    }
    s += `<path class="rank" d="${pad(A)}"/><path class="rank" d="${pad(B)}"/>`;
    // [bocht, t, soort, kant (1 = buiten, -1 = binnen)]
    const stukken = [
      [A, 0.12, "krul", 1], [A, 0.2, "blad", -1], [A, 0.3, "krul", -1], [A, 0.4, "blad", 1],
      [A, 0.62, "blad", 1], [A, 0.7, "krul", -1], [A, 0.8, "blad", -1],
      [B, 0.12, "krul", 1], [B, 0.22, "blad", -1], [B, 0.34, "krul", -1], [B, 0.42, "blad", 1],
      [B, 0.7, "blad", 1], [B, 0.78, "krul", -1], [B, 0.86, "blad", -1],
    ];
    for (const [p, t, soort, kant] of stukken) {
      const q = op(p, t);
      if (soort === "blad") s += sierblad(q.x, q.y, q.hoek - kant * 48, 15);
      if (soort === "krul") s += krul(q.x, q.y, q.hoek - kant * 35, 0.85, kant < 0);
    }
    // bloemen bovenop
    s += geelbloem(...Object.values(op(A, 0.02, 0)).slice(0, 2), 11, rng() * 45);
    s += sterbloem(...Object.values(op(A, 0.52, 2)).slice(0, 2), 21, 8 + rng() * 10);
    s += geelbloem(...Object.values(op(A, 0.97, -2)).slice(0, 2), 11, rng() * 45);
    s += geelbloem(...Object.values(op(B, 0.25, 2)).slice(0, 2), 11, rng() * 45);
    s += sterbloem(...Object.values(op(B, 0.56, 2)).slice(0, 2), 21, -20 + rng() * 10);
    s += geelbloem(...Object.values(op(B, 1, 0)).slice(0, 2), 11, rng() * 45);
    return s;
  }

  // kompasroos zoals op een oude zeekaart
  function kompas() {
    let s = "";
    // spitse straaltjes tussen de windrichtingen
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) continue;
      s += `<path class="straal" transform="rotate(${i * 22.5})" d="M-2.4 -50L0 -74L2.4 -50Z"/>`;
    }
    s += `<circle class="ring" r="56"/><circle class="ring" r="51"/>`;
    for (let i = 0; i < 72; i++) {
      const a = rad(i * 5), l = i % 3 ? 2.5 : 5;
      s += `<path class="streep" d="M${r1(Math.cos(a) * 51)} ${r1(Math.sin(a) * 51)}L${r1(Math.cos(a) * (51 - l))} ${r1(Math.sin(a) * (51 - l))}"/>`;
    }
    s += `<circle class="ring dun" r="36"/><circle class="ring stippel" r="31"/><circle class="ring dun" r="26"/>`;
    const punt = (hoek, l, b) =>
      `<g transform="rotate(${hoek})"><path class="punt-donker" d="M0 ${-l}L${b} 0L0 0Z"/><path class="punt-licht" d="M0 ${-l}L${-b} 0L0 0Z"/></g>`;
    for (const h of [45, 135, 225, 315]) s += punt(h, 44, 6);
    for (const h of [0, 90, 180, 270]) s += punt(h, 86, 8.5);
    s += `<circle class="midden" r="7"/><circle class="midden-hart" r="3"/>`;
    for (const [t, x, y] of [["N", 0, -93], ["E", 95, 1], ["S", 0, 97], ["W", -95, 1]]) {
      s += `<text class="windstreek" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${t}</text>`;
    }
    return s;
  }

  function sierRand(seed = 1) {
    const stuk = (klasse, viewBox, inhoud) =>
      `<svg class="sier ${klasse}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${inhoud}</svg>`;
    return (
      stuk("sier-rank sier-rb", "0 0 240 240", rank(seed)) +
      stuk("sier-rank sier-lo", "0 0 240 240", rank(seed + 7)) +
      stuk("sier-kompas sier-lb", "-105 -105 210 210", kompas()) +
      stuk("sier-kompas sier-ro", "-105 -105 210 210", kompas())
    );
  }

  // wit bloemetje (madeliefje in vooraanzicht), zelfde stijl als het gele
  function witbloem(x, y, r, hoek = 0) {
    let s = `<g class="witbloem" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(hoek)})">`;
    for (let i = 0; i < 12; i++) s += `<ellipse class="p" transform="rotate(${i * 30})" cy="${r1(-r * 0.58)}" rx="${r1(r * 0.16)}" ry="${r1(r * 0.42)}"/>`;
    return s + `<circle class="hart" r="${r1(r * 0.28)}"/></g>`;
  }

  // slinger met bloemen, in de stijl van de sierrand (vervangt het kransje)
  function slinger(seed = 1) {
    const rng = maakRng(seed);
    const half = (spiegel) => {
      const A = [[160, 42], [126, 26], [84, 60], [16, 38]];
      let s = "";
      const op = (t, d = 0) => {
        const b = bez(A, t);
        const n = rad(b.hoek - 90);
        return [b.x + Math.cos(n) * d, b.y + Math.sin(n) * d, b.hoek];
      };
      for (let i = 0; i < 6; i++) {
        const [x, y] = op(0.12 + i * 0.15, (i % 2 ? -1 : 1) * (9 + rng() * 6));
        s += `<circle class="${i % 3 ? "stip" : "stip-blauw"}" cx="${r1(x)}" cy="${r1(y)}" r="${r1(1.5 + rng())}"/>`;
      }
      s += `<path class="rank" d="${pad(A)}"/>`;
      for (const [t, soort, kant] of [[0.2, "blad", 1], [0.32, "krul", -1], [0.46, "blad", -1], [0.62, "krul", 1], [0.74, "blad", 1], [0.86, "blad", -1]]) {
        const [x, y, h] = op(t);
        s += soort === "blad" ? sierblad(x, y, h - kant * 48, 12) : krul(x, y, h - kant * 35, 0.7, kant < 0);
      }
      s += geelbloem(...op(0.4, 1).slice(0, 2), 9, rng() * 45);
      s += witbloem(...op(0.7, -1).slice(0, 2), 8, rng() * 30);
      s += geelbloem(...op(1).slice(0, 2), 10, rng() * 45);
      return spiegel ? `<g transform="translate(320 0) scale(-1 1)">${s}</g>` : s;
    };
    const s = half(false) + half(true) + sterbloem(160, 42, 19, rng() * 20);
    return `<svg class="bot bloei bot-slinger" viewBox="0 0 320 84" aria-hidden="true" focusable="false">${s}</svg>`;
  }

  // veldboeket in een glazen weckpot met touwtje, voor vragen zonder foto
  function boeket(seed = 1) {
    const rng = maakRng(seed);
    const bloemen = [
      ["ster", 150, 70, 32], ["geel", 88, 112, 22], ["ster", 214, 116, 29], ["wit", 124, 142, 18],
      ["geel", 182, 168, 23], ["ster", 74, 190, 26], ["geel", 240, 198, 19], ["wit", 204, 66, 16],
      ["geel", 118, 212, 19], ["wit", 164, 226, 17], ["geel", 46, 246, 16], ["ster", 252, 254, 21],
      ["wit", 94, 58, 15], ["geel", 150, 118, 18], ["wit", 60, 150, 14], ["geel", 262, 140, 15],
    ];
    let s = "";
    // stelen (achter de pot) en blaadjes
    for (const [, x, y] of bloemen) {
      const p = [[150 + (x - 150) * 0.08, 340], [150 + (x - 150) * 0.15, 300], [x + (150 - x) * 0.15, y + 80], [x, y]];
      s += `<path class="steel" d="${pad(p)}"/>`;
      const b = bez(p, 0.55 + rng() * 0.15);
      s += sierblad(b.x, b.y, b.hoek + (x < 150 ? -50 : 50) + 180, 22 + rng() * 6);
      const c = bez(p, 0.3 + rng() * 0.1);
      s += sierblad(c.x, c.y, c.hoek + (x < 150 ? 50 : -50) + 180, 18 + rng() * 5);
    }
    // stipjes rond het boeket
    for (let i = 0; i < 18; i++) {
      const a = rad(-170 + rng() * 160), d = 110 + rng() * 60;
      s += `<circle class="${rng() < 0.75 ? "stip" : "stip-blauw"}" cx="${r1(150 + Math.cos(a) * d)}" cy="${r1(180 + Math.sin(a) * d)}" r="${r1(1.6 + rng() * 1.4)}"/>`;
    }
    for (const [soort, x, y, r] of bloemen) {
      if (soort === "ster") s += sterbloem(x, y, r, rng() * 72);
      if (soort === "geel") s += geelbloem(x, y, r, rng() * 45);
      if (soort === "wit") s += witbloem(x, y, r, rng() * 30);
    }
    // weckpot (iets kleiner, onderaan)
    s += `<g transform="translate(150 470) scale(.78) translate(-150 -470)">`;
    s += `<path class="glas" d="M104 300h92v10c18 6 26 20 26 40v84c0 22-12 34-34 34h-76c-22 0-34-12-34-34v-84c0-20 8-34 26-40z"/>`;
    s += `<path class="glas-glans" d="M90 352v70"/><path class="glas-glans" d="M98 344v6"/>`;
    s += `<rect class="deksel" x="100" y="290" width="100" height="12" rx="3"/>`;
    s += `<path class="touw" d="M96 318c18 5 90 5 108 0M96 323c18 5 90 5 108 0"/>`;
    s += `<path class="touw" d="M150 322c-10-12-24-10-22-2s14 6 22 2c8 4 22 6 22-2s-12-10-22 2M150 322l-8 18M150 322l9 17"/>`;
    s += "</g>";
    return `<svg class="bot bloei bot-boeket" viewBox="0 0 300 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${s}</svg>`;
  }

  return { stengels, krans, slinger, boeket, sierRand };
})();
