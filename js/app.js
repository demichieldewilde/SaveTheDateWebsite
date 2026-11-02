(() => {
  "use strict";

  const SITE = window.SITE;
  const QUIZ = window.QUIZ;
  const TEKSTEN = window.TEKSTEN;
  const $ = (sel) => document.querySelector(sel);
  const OPSLAG = "std-amelie-michiel";
  const LOCALE = { nl: "nl-BE", fr: "fr-BE", en: "en-GB", de: "de-DE" };
  const STIJLEN = ["hoeve", "veldbloemen", "blauwe-inkt"];
  const ACHTERGRONDEN = ["standaard", "lichtblauw", "donkerblauw"];
  const AANWEZIG_NL = { ja: "Ja, zeker", misschien: "Waarschijnlijk", nee: "Helaas niet" };

  const opslag = {
    lees() {
      try { return JSON.parse(localStorage.getItem(OPSLAG)) || {}; } catch { return {}; }
    },
    schrijf(data) {
      try { localStorage.setItem(OPSLAG, JSON.stringify({ ...opslag.lees(), ...data })); } catch { /* privévenster */ }
    },
  };

  const params = new URLSearchParams(location.search);
  const isDinerGast = Boolean(SITE.dinerCode) && params.get("k") === SITE.dinerCode;
  const namen = `${SITE.namen.een} & ${SITE.namen.twee}`;

  let taal = kiesTaal();
  let huidige = 0;
  let keuzes = [];      // gekozen antwoord per vraag
  let titels = [];      // welke "Juist!/Bijna" per vraag
  let naQuiz = false;

  /* ---------- taal ---------- */

  function kiesTaal() {
    const kandidaten = [params.get("lang"), opslag.lees().taal, (navigator.language || "").slice(0, 2)];
    return kandidaten.find((k) => SITE.talen.includes(k)) || SITE.standaardTaal;
  }

  function t(sleutel, vars = {}) {
    const s = TEKSTEN[taal]?.[sleutel] ?? TEKSTEN.nl[sleutel] ?? sleutel;
    if (typeof s !== "string") return s;
    const standaard = { namen, een: SITE.namen.een, twee: SITE.namen.twee };
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : standaard[k] ?? m));
  }

  // vertaal een { nl, fr, en, de }-object uit de config
  function vt(obj) {
    if (obj == null) return "";
    const s = typeof obj === "string" ? obj : obj[taal] ?? obj.nl ?? "";
    return s.replace("{datum}", datumLang());
  }

  const datumLang = () =>
    new Date(`${SITE.datum.iso}T12:00:00`).toLocaleDateString(LOCALE[taal], {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

  function zetTaal(nieuw) {
    taal = nieuw;
    opslag.schrijf({ taal });
    document.documentElement.lang = LOCALE[taal];
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll("[data-t-html]").forEach((el) => { el.innerHTML = t(el.dataset.tHtml); });
    document.querySelectorAll("[data-t-ph]").forEach((el) => { el.placeholder = t(el.dataset.tPh); });
    document.querySelectorAll("[data-t-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.tAria)));
    document.querySelectorAll("[data-taal]").forEach((k) => k.setAttribute("aria-pressed", k.dataset.taal === taal));

    $("#std-datum").textContent = SITE.datum.kort;
    $("#std-plaats").textContent = `${SITE.feest.locatie} · ${SITE.feest.gemeente}`;
    $("#voet-tekst").textContent = `${namen} · ${datumLang()}`;
    zetScore();
    bouwTijdlijn();
    bouwAgendaLink();
    if ($("#quiz").classList.contains("actief")) toonVraag(false);
  }

  function bouwTaalknoppen() {
    const nav = $("#talen");
    SITE.talen.forEach((code) => {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.dataset.taal = code;
      knop.textContent = code.toUpperCase();
      knop.title = TEKSTEN[code].taalNaam;
      knop.lang = code;
      knop.addEventListener("click", () => zetTaal(code));
      nav.append(knop);
    });
  }

  /* ---------- stijl ---------- */

  function zetStijl(stijl) {
    if (!STIJLEN.includes(stijl)) stijl = "hoeve";
    document.documentElement.dataset.stijl = stijl;
    document.querySelectorAll("[data-stijl-knop]").forEach((k) =>
      k.setAttribute("aria-pressed", k.dataset.stijlKnop === stijl));
    if (SITE.stijlKiezer) opslag.schrijf({ stijl });
  }

  function zetAchtergrond(achtergrond) {
    if (!ACHTERGRONDEN.includes(achtergrond)) achtergrond = "standaard";
    document.documentElement.dataset.achtergrond = achtergrond;
    document.querySelectorAll("[data-achtergrond-knop]").forEach((k) =>
      k.setAttribute("aria-pressed", k.dataset.achtergrondKnop === achtergrond));
    const meta = document.querySelector('meta[name="theme-color"]');
    meta.content = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (SITE.stijlKiezer) opslag.schrijf({ achtergrond });
  }

  /* ---------- schermen ---------- */

  function toonScherm(id) {
    document.querySelectorAll(".scherm").forEach((s) => s.classList.toggle("actief", s.id === id));
    if (id !== "quiz") document.querySelectorAll(".vraag-beeld video").forEach((v) => v.pause());
    $("#voortgang").hidden = id !== "quiz";
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  /* ---------- quiz ---------- */

  const LETTERS = "ABCDEFGHIJ";
  let selectie = new Set();   // aangeduide antwoorden bij de huidige vraag, nog niet getoond
  let kaart = null;           // Leaflet-kaart bij een kaartvraag
  let pinnen = [];            // markers op die kaart
  let openPin = null;         // pin waarvan de info getoond wordt

  const keuzeLijst = (q) => (q.kaart ? q.kaart.pinnen : q.antwoorden);
  const alleGoed = (q) => !q.kaart && (q.juist == null || q.juist === "alle");
  const juisteSet = (q) =>
    q.kaart
      ? q.kaart.pinnen.flatMap((p, i) => (p.juist ? [i] : []))
      : [].concat(q.juist);

  // juist = precies de juiste antwoorden aangeduid, niet meer en niet minder
  function isJuist(q, gekozen) {
    if (alleGoed(q)) return gekozen.length > 0;
    const juist = juisteSet(q);
    return gekozen.length === juist.length && juist.every((i) => gekozen.includes(i));
  }

  function status(q, i, gekozen) {
    const aangeduid = gekozen.includes(i);
    if (alleGoed(q)) return aangeduid ? "juist" : "";
    const hoort = juisteSet(q).includes(i);
    if (hoort) return aangeduid ? "juist" : "gemist";
    return aangeduid ? "fout" : "";
  }

  function startQuiz() {
    huidige = 0;
    keuzes = [];
    titels = [];
    toonScherm("quiz");
    toonVraag(true);
  }

  function toonVraag(nieuw) {
    const q = QUIZ[huidige];
    const getoond = keuzes[huidige] !== undefined;
    $("#vraag-nr").textContent = t("vraagNr", { n: huidige + 1, t: QUIZ.length });
    $("#vraag-tekst").textContent = vt(q.vraag);
    $("#vraag-hint").textContent = getoond ? "" : t(q.kaart ? "kaartHint" : "meerdereHint");

    if (nieuw) {
      selectie = new Set();
      bouwBeeld(q);
      $(".vraag-inhoud").classList.remove("verschijn");
      void $(".vraag-inhoud").offsetWidth;
      $(".vraag-inhoud").classList.add("verschijn");
    }

    const box = $("#antwoorden");
    box.replaceChildren();
    box.className = "antwoorden";
    if (q.kaart) {
      box.classList.add("antwoorden-kaart");
      pinnen.forEach((m, i) => m.setTooltipContent(vt(q.kaart.pinnen[i].naam)));
    } else {
      box.classList.toggle("antwoorden-fotos", q.antwoorden.some((a) => a.foto));
      box.classList.toggle("antwoorden-veel", q.antwoorden.length > 4);
      q.antwoorden.forEach((a, i) => {
        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "antwoord";
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = LETTERS[i];
        knop.append(letter);
        if (a.foto) {
          const img = document.createElement("img");
          img.src = a.foto;
          img.alt = vt(a.alt);
          knop.append(img);
        } else {
          const tekst = document.createElement("span");
          tekst.textContent = vt(a);
          knop.append(tekst);
        }
        knop.addEventListener("click", () => wissel(i));
        box.append(knop);
      });
    }

    $("#feedback").hidden = true;
    zetSelectie();
    zetVoortgang();
    if (getoond) toonResultaat(false);
    else if (nieuw) $("#vraag-tekst").focus({ preventScroll: true });
  }

  function bouwBeeld(q) {
    const beeld = $("#vraag-beeld");
    const fotos = q.fotos || [];
    const binnen = document.createElement("div");
    binnen.className = "beeld-binnen";
    beeld.className = "vraag-beeld";
    beeld.replaceChildren(binnen);
    if (kaart) { kaart.remove(); kaart = null; pinnen = []; }
    openPin = null;
    $("#quiz").classList.toggle("is-kaartvraag", Boolean(q.kaart));
    $("#kaart-rij").hidden = !q.kaart;

    if (q.kaart) {
      bouwKaart(q, $("#kaart-plek"));
      return;
    }
    if (q.video) {
      beeld.classList.add("beeld-een");
      const fig = document.createElement("figure");
      const video = Object.assign(document.createElement("video"), {
        src: q.video, controls: true, playsInline: true, loop: true, preload: "auto",
      });
      fig.append(video);
      binnen.append(fig);
      // met geluid starten; lukt dat niet (strenge browser), dan zonder geluid
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
      return;
    }
    if (!fotos.length) {
      beeld.classList.add("beeld-illustratie");
      binnen.innerHTML = window.Botanisch.stengels(huidige + 4);
      return;
    }
    beeld.classList.add(fotos.length > 1 ? "beeld-duo" : "beeld-een");
    fotos.slice(0, 2).forEach((src) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      fig.append(img);
      binnen.append(fig);
    });
  }

  function bouwKaart(q, doel) {
    const vak = document.createElement("div");
    vak.className = "kaart-vak";
    doel.replaceChildren(vak);
    kaart = L.map(vak, { scrollWheelZoom: false, zoomSnap: 0.25 });
    const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_";
    L.tileLayer(`${esri}Base/MapServer/tile/{z}/{y}/{x}`, {
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      maxZoom: 16,
    }).addTo(kaart);
    L.tileLayer(`${esri}Reference/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 16 }).addTo(kaart);
    if (q.kaart.route) {
      L.polyline(q.kaart.route, { className: "kaart-route", interactive: false }).addTo(kaart);
    }
    pinnen = q.kaart.pinnen.map((p, i) => {
      const m = L.marker([p.lat, p.lon], {
        icon: L.divIcon({ className: "pin", html: "<span></span>", iconSize: [22, 22] }),
        keyboard: true,
        title: vt(p.naam),
      });
      const vast = Boolean(q.kaart.namenTonen);
      const kant = { boven: "top", onder: "bottom", links: "left", rechts: "right" }[p.kant] || (vast ? "right" : "top");
      const verschuif = { top: [0, -10], bottom: [0, 10], left: [-10, 0], right: [10, 0] }[kant];
      m.bindTooltip(vt(p.naam), {
        permanent: vast, direction: kant, offset: verschuif, className: vast ? "pin-naam" : "",
      });
      m.on("click", () => klikPin(i));
      return m.addTo(kaart);
    });
    const punten = [...q.kaart.pinnen.map((p) => [p.lat, p.lon]), ...(q.kaart.route || [])];
    // extra ruimte zodat de namen naast de pinnen niet van de kaart vallen
    const rand = q.kaart.namenTonen ? [10, 30] : [24, 24];
    kaart.fitBounds(L.latLngBounds(punten), { padding: rand });
    setTimeout(() => {
      if (!kaart) return;
      kaart.invalidateSize();
      if (q.kaart.namenTonen) {
        plaatsNamen();
        kaart.on("zoomend", plaatsNamen);
      }
    }, 50);
  }

  // zet elke naam aan een kant waar hij niets overlapt en binnen de kaart blijft
  function plaatsNamen() {
    const vak = kaart.getContainer().getBoundingClientRect();
    const bezet = pinnen.map((m) => m.getElement().getBoundingClientRect());
    const KANTEN = { top: [0, -10], right: [10, 0], left: [-10, 0], bottom: [0, 10] };
    const overlapt = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    pinnen.forEach((m) => {
      const tip = m.getTooltip();
      const voorkeur = tip.options.voorkeur || (tip.options.voorkeur = tip.options.direction);
      const volgorde = [voorkeur, ...Object.keys(KANTEN).filter((k) => k !== voorkeur)];
      // eerste kant zonder botsing; anders de kant met de minste botsingen
      let beste = null;
      for (const kant of volgorde) {
        tip.options.direction = kant;
        tip.options.offset = L.point(KANTEN[kant]);
        tip.update();
        const r = tip.getElement().getBoundingClientRect();
        const binnen = r.left >= vak.left && r.right <= vak.right && r.top >= vak.top && r.bottom <= vak.bottom;
        const score = (binnen ? 0 : 100) + bezet.filter((b) => overlapt(r, b)).length;
        if (!beste || score < beste.score) beste = { kant, score };
        if (score === 0) break;
      }
      tip.options.direction = beste.kant;
      tip.options.offset = L.point(KANTEN[beste.kant]);
      tip.update();
      bezet.push(tip.getElement().getBoundingClientRect());
    });
  }

  function klikPin(i) {
    const q = QUIZ[huidige];
    if (keuzes[huidige] !== undefined) return toonPinInfo(i);
    if (q.kaart.direct) {
      // meteen tonen of we daar waren; aangetikt blijft aangetikt
      selectie.add(i);
      zetSelectie();
      toonPinInfo(i);
      return;
    }
    wissel(i);
  }

  function wissel(i) {
    if (keuzes[huidige] !== undefined) return;
    if (selectie.has(i)) selectie.delete(i);
    else selectie.add(i);
    zetSelectie();
  }

  function zetSelectie() {
    const q = QUIZ[huidige];
    const getoond = keuzes[huidige] !== undefined;
    if (q.kaart) {
      pinnen.forEach((m, i) => {
        const el = m.getElement();
        if (!el || getoond) return;
        const aan = selectie.has(i);
        el.classList.toggle("aangeduid", aan && !q.kaart.direct);
        if (q.kaart.direct && aan) el.classList.add(q.kaart.pinnen[i].juist ? "juist" : "fout");
      });
      const info = $("#pin-info");
      info.hidden = !(q.kaart.direct || getoond);
      if (!info.hidden) toonPinInfo(openPin);
      const box = $("#antwoorden");
      box.replaceChildren();
      if (!getoond && !q.kaart.direct) {
        const lijst = [...selectie].sort((a, b) => a - b).map((i) => vt(q.kaart.pinnen[i].naam));
        const p = document.createElement("p");
        p.className = "kaart-gekozen";
        p.textContent = lijst.length ? `${t("aangeduid")} ${lijst.join(", ")}` : "";
        box.append(p);
      }
    } else {
      [...$("#antwoorden").children].forEach((k, i) => k.setAttribute("aria-pressed", selectie.has(i)));
    }
    const toon = $("#toon-antwoord");
    toon.hidden = getoond;
    toon.disabled = selectie.size === 0;
    toon.textContent = t("toonAntwoord");
  }

  $("#toon-antwoord").addEventListener("click", () => {
    if (!selectie.size || keuzes[huidige] !== undefined) return;
    keuzes[huidige] = [...selectie].sort((a, b) => a - b);
    titels[huidige] = Math.floor(Math.random() * 3);
    toonResultaat(true);
  });

  function zetVoortgang() {
    const klaar = keuzes.filter((k) => k !== undefined).length;
    $("#voortgang i").style.width = `${(klaar / QUIZ.length) * 100}%`;
  }

  function toonResultaat(animeer) {
    const q = QUIZ[huidige];
    const gekozen = keuzes[huidige];
    const goed = isJuist(q, gekozen);

    $("#vraag-hint").textContent = "";
    $("#toon-antwoord").hidden = true;
    const box = $("#antwoorden");
    box.classList.add("beantwoord");
    if (!animeer) box.classList.add("zonder-animatie");
    const juist = alleGoed(q) ? [] : juisteSet(q);
    const gevonden = juist.filter((i) => gekozen.includes(i)).length;
    const teVeel = gekozen.filter((i) => !juist.includes(i)).length;

    if (q.kaart) {
      box.replaceChildren();
      pinnen.forEach((m, i) => {
        const el = m.getElement();
        if (!el) return;
        el.classList.remove("aangeduid", "juist", "gemist", "fout");
        const s = status(q, i, gekozen);
        if (s) el.classList.add(s);
        el.classList.add("getoond");
      });
      if (juist.length > 1) {
        const p = document.createElement("p");
        p.className = "kaart-gekozen";
        p.textContent = t("kaartScore", { g: gevonden, t: juist.length, f: teVeel });
        box.append(p);
      }
    } else {
      [...box.children].forEach((k, i) => {
        k.disabled = true;
        k.removeAttribute("aria-pressed");
        const s = status(q, i, gekozen);
        if (s) k.classList.add(s);
      });
    }

    const fb = $("#feedback");
    fb.className = `feedback ${goed ? "is-juist" : "is-fout"}`;
    // bij meerdere juiste antwoorden: zeg hoeveel er juist waren
    $("#feedback-titel").textContent = !goed && juist.length > 1
      ? t("deelsJuist", { g: gevonden, t: juist.length })
      : t(goed ? "juist" : "fout")[titels[huidige] || 0];
    $("#feedback-tekst").textContent = goed ? vt(q.bravo) : vt(q.uitleg);

    // foto of kaartje dat pas na het antwoorden verschijnt
    const fbFoto = $("#feedback-foto");
    fbFoto.hidden = !q.fotoNa;
    if (q.fotoNa) {
      fbFoto.querySelector("img").src = q.fotoNa.foto;
      fbFoto.querySelector("img").alt = vt(q.fotoNa.alt);
      fbFoto.querySelector("figcaption").textContent = vt(q.fotoNa.bijschrift);
    }

    const info = $("#pin-info");
    info.hidden = !q.kaart;
    if (q.kaart) toonPinInfo(openPin);

    $("#volgende").textContent = huidige === QUIZ.length - 1 ? t("laatste") : t("volgende");
    fb.hidden = false;
    zetVoortgang();
    if (animeer) setTimeout(() => fb.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  }

  // na het tonen: klik op een pin om te zien wat we daar deden
  function toonPinInfo(i) {
    const q = QUIZ[huidige];
    const info = $("#pin-info");
    openPin = i;
    info.replaceChildren();
    if (i == null) {
      const p = document.createElement("p");
      p.className = "pin-hint";
      p.textContent = t(keuzes[huidige] !== undefined ? "kaartKlik" : "kaartDirect");
      info.append(p);
      return;
    }
    const pin = q.kaart.pinnen[i];
    const h = document.createElement("h3");
    h.textContent = vt(pin.naam);
    info.append(h);
    const p = document.createElement("p");
    p.textContent = vt(pin.tekst) || (pin.juist ? "" : t("nogNiet"));
    info.append(p);
    if (pin.fotos?.length) {
      const rij = document.createElement("div");
      rij.className = "pin-fotos";
      rij.style.setProperty("--kolommen", pin.fotos.length === 1 ? 1 : 2);
      pin.fotos.forEach((src) => {
        const img = Object.assign(document.createElement("img"), { src, alt: "", loading: "lazy" });
        rij.append(img);
      });
      info.append(rij);
    }
    pinnen.forEach((m, j) => m.getElement()?.classList.toggle("open", j === i));
  }

  $("#volgende").addEventListener("click", () => {
    if (huidige < QUIZ.length - 1) {
      huidige++;
      window.scrollTo({ top: 0, behavior: "instant" });
      toonVraag(true);
    } else {
      naQuiz = true;
      opslag.schrijf({ klaar: true, score: score() });
      onthul();
    }
  });

  const score = () => QUIZ.filter((q, i) => keuzes[i] !== undefined && isJuist(q, keuzes[i])).length;

  /* ---------- onthulling ---------- */

  function onthul() {
    toonScherm("onthulling");
    zetScore();
  }

  function zetScore() {
    $("#score").textContent = naQuiz ? t("score", { s: score(), t: QUIZ.length }) : "";
  }

  /* ---------- wanneer & waar ---------- */

  function bouwTijdlijn() {
    const items = [
      { titel: t("kerk"), uur: SITE.kerk.uur, plaats: SITE.kerk.locatie || null },
    ];
    if (isDinerGast) items.push({ titel: t("diner"), uur: SITE.diner.uur, plaats: SITE.diner.locatie });
    items.push({ titel: t("feest"), uur: SITE.feest.uur, plaats: SITE.feest.locatie, link: SITE.feest.kaartLink });

    const ol = $("#tijdlijn");
    ol.replaceChildren();
    for (const it of items) {
      const li = document.createElement("li");
      const uur = document.createElement("span");
      uur.className = "tl-uur";
      uur.textContent = it.uur || "—";
      const wat = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.textContent = it.titel;
      const p = document.createElement("p");
      if (it.plaats && it.link) {
        const a = Object.assign(document.createElement("a"), { href: it.link, target: "_blank", rel: "noopener" });
        a.textContent = `${it.plaats}, ${SITE.feest.gemeente}`;
        p.append(a);
      } else {
        p.textContent = it.plaats ? `${it.plaats}, ${SITE.feest.gemeente}` : t("locatieVolgt");
      }
      if (!it.uur) {
        const volgt = document.createElement("em");
        volgt.textContent = ` · ${t("uurVolgt")}`;
        p.append(volgt);
      }
      wat.append(h3, p);
      li.append(uur, wat);
      ol.append(li);
    }

    const dagen = Math.ceil((new Date(`${SITE.datum.iso}T00:00:00`) - new Date()) / 864e5);
    $("#aftellen").textContent = dagen > 0 ? t("aftellen", { n: dagen }) : datumLang();
  }

  /* ---------- agenda ---------- */

  const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  function bouwAgendaLink() {
    const a = SITE.agenda;
    const g = new URL("https://calendar.google.com/calendar/render");
    g.searchParams.set("action", "TEMPLATE");
    g.searchParams.set("text", t("agendaTitel"));
    g.searchParams.set("dates", `${utc(a.start)}/${utc(a.einde)}`);
    g.searchParams.set("location", a.locatie);
    g.searchParams.set("details", `${t("agendaInfo")} ${location.href.split("?")[0]}`);
    $("#google-agenda").href = g.toString();
  }

  $("#ics").addEventListener("click", () => {
    const a = SITE.agenda;
    const esc = (s) => s.replace(/[,;]/g, "\\$&");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Amelie en Michiel//Save the date//NL",
      "BEGIN:VEVENT",
      `UID:std-${SITE.datum.iso}@amelie-michiel`,
      `DTSTAMP:${utc(new Date().toISOString())}`,
      `DTSTART:${utc(a.start)}`,
      `DTEND:${utc(a.einde)}`,
      `SUMMARY:${esc(t("agendaTitel"))}`,
      `LOCATION:${esc(a.locatie)}`,
      `DESCRIPTION:${esc(t("agendaInfo"))}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: "save-the-date-amelie-michiel.ics" });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  /* ---------- formulier ---------- */

  function bouwFormulier() {
    const form = $("#formulier");
    const melding = $("#form-melding");

    form.addEventListener("input", (e) => {
      e.target.classList.remove("ongeldig");
      e.target.closest(".keuzes")?.classList.remove("ongeldig");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      melding.textContent = "";
      form.querySelectorAll(".ongeldig").forEach((el) => el.classList.remove("ongeldig"));

      const fouten = [];
      if (!form.naam.value.trim()) { fouten.push(t("formFoutNaam")); form.naam.classList.add("ongeldig"); }
      if (!form.email.value || !form.email.checkValidity()) { fouten.push(t("formFoutEmail")); form.email.classList.add("ongeldig"); }
      if (!form.aanwezig.value) { fouten.push(t("formFoutAanwezig")); form.querySelector(".keuzes").classList.add("ongeldig"); }
      // het adres is nodig om de uitnodiging per post te sturen, behalve als iemand niet komt
      const adresLeeg = ["straat", "postcode", "gemeente"].filter((n) => !form[n].value.trim());
      if (form.aanwezig.value !== "nee" && adresLeeg.length) {
        fouten.push(t("formFoutAdres"));
        adresLeeg.forEach((n) => form[n].classList.add("ongeldig"));
      }
      if (fouten.length) {
        melding.textContent = t("formVulIn", { lijst: fouten.join(", ") });
        form.querySelector("input.ongeldig, .ongeldig input")?.focus();
        return;
      }
      if (!SITE.formulierUrl) {
        melding.textContent = t("formNietGekoppeld");
        return;
      }

      const komt = form.aanwezig.value !== "nee";
      const data = new URLSearchParams({
        naam: form.naam.value.trim(),
        email: form.email.value.trim(),
        aanwezig: AANWEZIG_NL[form.aanwezig.value],
        straat: form.straat.value.trim(),
        postcode: form.postcode.value.trim(),
        gemeente: form.gemeente.value.trim(),
        land: form.land.value.trim(),
        bericht: form.bericht.value.trim(),
        uitnodiging: isDinerGast ? "diner + feest" : "feest",
        taal: taal.toUpperCase(),
        quizscore: opslag.lees().klaar ? `${opslag.lees().score}/${QUIZ.length}` : "",
        website: form.website.value,
      });

      const knop = $("#verstuur");
      knop.disabled = true;
      knop.textContent = t("formBezig");
      try {
        await verstuur(data);
        form.hidden = true;
        $("#bedankt-tekst").textContent = komt
          ? t("bedanktJa", { naam: data.get("naam").split(/[ &]/)[0] })
          : t("bedanktNee");
        $("#bedankt").hidden = false;
        $("#bedankt").focus();
      } catch {
        melding.textContent = t("formFout");
      } finally {
        knop.disabled = false;
        knop.textContent = t("formVerstuur");
      }
    });
  }

  async function verstuur(data) {
    try {
      const antwoord = await fetch(SITE.formulierUrl, { method: "POST", body: data });
      const json = await antwoord.json();
      if (!json.ok) throw new Error(json.fout || "onbekende fout");
    } catch (err) {
      // Als de browser het antwoord niet mag lezen (CORS), versturen we 'blind'.
      if (err instanceof TypeError) {
        await fetch(SITE.formulierUrl, { method: "POST", body: data, mode: "no-cors" });
        return;
      }
      throw err;
    }
  }

  /* ---------- start ---------- */

  document.querySelectorAll("[data-bot]").forEach((el) => {
    const [soort, seed] = el.dataset.bot.split(":");
    el.innerHTML = window.Botanisch[soort](Number(seed));
  });

  const naamDelen = [SITE.namen.een, "&", SITE.namen.twee].map((s, i) => {
    const el = document.createElement(i === 1 ? "i" : "span");
    el.textContent = s;
    return el;
  });
  $("#std-namen").append(...naamDelen);
  $("#kaart-foto").src = SITE.fotoKaart;
  $("#intro-foto").src = SITE.fotoIntro;

  bouwTaalknoppen();
  bouwFormulier();
  zetTaal(taal);

  const kiezer = $("#stijlkiezer");
  kiezer.hidden = !SITE.stijlKiezer;
  kiezer.querySelectorAll("[data-stijl-knop]").forEach((k) =>
    k.addEventListener("click", () => zetStijl(k.dataset.stijlKnop)));
  kiezer.querySelectorAll("[data-achtergrond-knop]").forEach((k) =>
    k.addEventListener("click", () => zetAchtergrond(k.dataset.achtergrondKnop)));
  zetStijl(params.get("stijl") || (SITE.stijlKiezer && opslag.lees().stijl) || SITE.stijl);
  zetAchtergrond(params.get("achtergrond") || (SITE.stijlKiezer && opslag.lees().achtergrond) || SITE.achtergrond);

  $("#start").addEventListener("click", startQuiz);
  $("#overslaan").addEventListener("click", () => onthul());
  $("#opnieuw").addEventListener("click", () => toonScherm("intro"));
  $("#overslaan").hidden = !opslag.lees().klaar;
})();
