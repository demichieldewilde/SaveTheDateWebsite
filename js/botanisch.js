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

  return { stengels, krans };
})();
