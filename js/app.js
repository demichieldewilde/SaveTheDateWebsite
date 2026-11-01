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
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : k === "namen" ? namen : m));
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
    $("#voortgang").hidden = id !== "quiz";
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  /* ---------- quiz ---------- */

  const LETTERS = "ABCDEFGHIJ";
  const juisteAntwoorden = (q) => [].concat(q.juist);
  const isJuist = (q, keuze) => q.juist == null || q.juist === "alle" || juisteAntwoorden(q).includes(keuze);

  function startQuiz() {
    huidige = 0;
    keuzes = [];
    titels = [];
    toonScherm("quiz");
    toonVraag(true);
  }

  function toonVraag(nieuw) {
    const q = QUIZ[huidige];
    $("#vraag-nr").textContent = t("vraagNr", { n: huidige + 1, t: QUIZ.length });
    $("#vraag-tekst").textContent = vt(q.vraag);

    if (nieuw) {
      bouwBeeld(q);
      $(".vraag-inhoud").classList.remove("verschijn");
      void $(".vraag-inhoud").offsetWidth;
      $(".vraag-inhoud").classList.add("verschijn");
    }

    const box = $("#antwoorden");
    box.replaceChildren();
    box.className = "antwoorden";
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
      knop.addEventListener("click", () => beantwoord(i));
      box.append(knop);
    });

    $("#feedback").hidden = true;
    zetVoortgang();
    if (keuzes[huidige] !== undefined) toonResultaat(false);
    else if (nieuw) $("#vraag-tekst").focus({ preventScroll: true });
  }

  function bouwBeeld(q) {
    const beeld = $("#vraag-beeld");
    const fotos = q.fotos || [];
    const binnen = document.createElement("div");
    binnen.className = "beeld-binnen";
    beeld.className = "vraag-beeld";
    beeld.replaceChildren(binnen);
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

  function zetVoortgang() {
    const klaar = keuzes.filter((k) => k !== undefined).length;
    $("#voortgang i").style.width = `${(klaar / QUIZ.length) * 100}%`;
  }

  function beantwoord(keuze) {
    if (keuzes[huidige] !== undefined) return;
    keuzes[huidige] = keuze;
    titels[huidige] = Math.floor(Math.random() * 3);
    toonResultaat(true);
  }

  function toonResultaat(animeer) {
    const q = QUIZ[huidige];
    const keuze = keuzes[huidige];
    const goed = isJuist(q, keuze);
    const alleGoed = q.juist == null || q.juist === "alle";

    const box = $("#antwoorden");
    box.classList.add("beantwoord");
    if (!animeer) box.classList.add("zonder-animatie");
    [...box.children].forEach((k, i) => {
      k.disabled = true;
      if (i === keuze) k.classList.add("gekozen", goed ? "juist" : "fout");
      if (!alleGoed && juisteAntwoorden(q).includes(i)) k.classList.add("juist");
    });

    const fb = $("#feedback");
    fb.className = `feedback ${goed ? "is-juist" : "is-fout"}`;
    $("#feedback-titel").textContent = t(goed ? "juist" : "fout")[titels[huidige] || 0];
    $("#feedback-tekst").textContent = goed ? vt(q.bravo) : vt(q.uitleg);
    $("#volgende").textContent = huidige === QUIZ.length - 1 ? t("laatste") : t("volgende");
    fb.hidden = false;
    zetVoortgang();
    if (animeer) setTimeout(() => fb.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
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
  $("#opnieuw").addEventListener("click", startQuiz);
  $("#overslaan").hidden = !opslag.lees().klaar;
})();
