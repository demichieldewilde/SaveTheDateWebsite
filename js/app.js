(() => {
  "use strict";

  const SITE = window.SITE;
  const QUIZ = window.QUIZ;
  const $ = (sel) => document.querySelector(sel);
  const OPSLAG = "std-amelie-michiel";

  const isDinerGast = Boolean(SITE.dinerCode) &&
    new URLSearchParams(location.search).get("k") === SITE.dinerCode;

  let huidige = 0;
  let score = 0;

  /* ---------- kleine hulpjes ---------- */

  const opslag = {
    lees() {
      try { return JSON.parse(localStorage.getItem(OPSLAG)) || {}; } catch { return {}; }
    },
    schrijf(data) {
      try { localStorage.setItem(OPSLAG, JSON.stringify({ ...opslag.lees(), ...data })); } catch { /* privévenster */ }
    },
  };

  const willekeurig = (lijst) => lijst[Math.floor(Math.random() * lijst.length)];

  function bloemSvg(id = "bloem") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", `#${id}`);
    svg.append(use);
    return svg;
  }

  function toonScherm(id) {
    document.querySelectorAll(".scherm").forEach((s) => s.classList.toggle("actief", s.id === id));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  /* ---------- teksten uit de config invullen ---------- */

  const namen = `${SITE.namen.een} & ${SITE.namen.twee}`;
  const velden = {
    namen,
    datumKort: SITE.datum.kort,
    datumLang: SITE.datum.lang,
    gemeente: SITE.feest.gemeente,
    feestLocatie: SITE.feest.locatie,
    stempel: `${SITE.feest.gemeente.toUpperCase()} · ${SITE.datum.kort} · `.repeat(2),
  };
  document.querySelectorAll("[data-veld]").forEach((el) => {
    el.textContent = velden[el.dataset.veld] ?? "";
  });
  $("#kaart-foto").src = SITE.fotoKaart;
  $("#postzegel-foto").src = SITE.fotoPostzegel;

  /* ---------- voortgang ---------- */

  const voortgang = $(".voortgang");
  QUIZ.forEach(() => {
    const li = document.createElement("li");
    li.append(bloemSvg());
    voortgang.append(li);
  });

  function zetVoortgang() {
    [...voortgang.children].forEach((li, i) => li.classList.toggle("huidig", i === huidige));
  }

  /* ---------- quiz ---------- */

  const LETTERS = "ABCDEF";
  const JUIST = ["Juist!", "Helemaal mee!", "Bingo!", "Knap gedaan!"];
  const FOUT = ["Bijna…", "Net niet!", "Oei!", "Mis, maar dat geeft niet."];

  function toonVraag() {
    const q = QUIZ[huidige];
    zetVoortgang();

    $("#vraag-nr").textContent = huidige + 1;
    $("#vraag-totaal").textContent = `${huidige + 1} / ${QUIZ.length}`;
    $("#vraag-tekst").textContent = q.vraag;

    const fig = $("#vraag-foto");
    fig.hidden = !q.foto;
    if (q.foto) fig.querySelector("img").src = q.foto;

    const box = $("#antwoorden");
    box.replaceChildren();
    box.className = "antwoorden";
    const metFotos = q.antwoorden.some((a) => a.foto);
    box.classList.toggle("antwoorden-fotos", metFotos);

    q.antwoorden.forEach((a, i) => {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.className = "antwoord";
      knop.dataset.letter = LETTERS[i];
      if (a.foto) {
        const img = document.createElement("img");
        img.src = a.foto;
        img.alt = a.alt || "";
        img.loading = "lazy";
        knop.append(img);
        knop.setAttribute("aria-label", `${LETTERS[i]}: ${a.alt || "foto"}`);
      } else {
        knop.append(a.tekst);
      }
      knop.addEventListener("click", () => beantwoord(i));
      box.append(knop);
    });

    $("#feedback").hidden = true;
    $("#vraag-tekst").focus({ preventScroll: true });
  }

  function beantwoord(keuze) {
    const q = QUIZ[huidige];
    const knoppen = [...document.querySelectorAll(".antwoord")];
    const alleJuist = q.juist === "alle";
    const goed = alleJuist || keuze === q.juist;
    if (goed) score++;

    $("#antwoorden").classList.add("beantwoord");
    knoppen.forEach((k, i) => {
      k.disabled = true;
      if (i === keuze) k.classList.add("gekozen", goed ? "juist" : "fout");
      if (!alleJuist && i === q.juist) k.classList.add("juist");
    });

    voortgang.children[huidige].classList.add(goed ? "juist" : "fout");

    const fb = $("#feedback");
    fb.className = `feedback ${goed ? "is-juist" : "is-fout"}`;
    $("#feedback-titel").textContent = willekeurig(goed ? JUIST : FOUT);
    $("#feedback-tekst").textContent = goed ? (q.bravo || "") : (q.uitleg || "");
    const laatste = huidige === QUIZ.length - 1;
    $("#volgende").textContent = laatste ? "Bekijk ons nieuws →" : "Volgende vraag →";
    fb.hidden = false;
    fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  $("#volgende").addEventListener("click", () => {
    if (huidige < QUIZ.length - 1) {
      huidige++;
      toonVraag();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onthul(true);
    }
  });

  function startQuiz() {
    huidige = 0;
    score = 0;
    [...voortgang.children].forEach((li) => li.classList.remove("juist", "fout"));
    voortgang.hidden = false;
    toonScherm("quiz");
    toonVraag();
  }

  /* ---------- onthulling ---------- */

  function onthul(naQuiz) {
    voortgang.hidden = true;
    toonScherm("onthulling");
    $("#kaart").classList.remove("omgedraaid");

    if (naQuiz) {
      opslag.schrijf({ klaar: true, score });
      $("#score").textContent = `Je had ${score} van de ${QUIZ.length} juist`;
      blaadjesRegen();
    } else {
      $("#score").textContent = "";
    }
    // even de voorkant tonen, dan zelf omdraaien
    clearTimeout(onthul.timer);
    onthul.timer = setTimeout(() => $("#kaart").classList.add("omgedraaid"), 3200);
  }

  const draaiKaart = () => {
    clearTimeout(onthul.timer);
    $("#kaart").classList.toggle("omgedraaid");
  };
  $("#kaart").addEventListener("click", draaiKaart);
  $("#draai").addEventListener("click", draaiKaart);

  function blaadjesRegen() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const kleuren = ["#5E84E2", "#FFA62B", "#F7EC8D", "#8B6EC7", "#86C5FF", "#F6A93A"];
    const doos = $("#blaadjes");
    doos.replaceChildren();
    for (let i = 0; i < 46; i++) {
      const b = document.createElement("span");
      b.className = "blaadje";
      b.style.left = `${Math.random() * 100}%`;
      b.style.background = willekeurig(kleuren);
      b.style.setProperty("--dx", `${(Math.random() - 0.5) * 220}px`);
      b.style.setProperty("--rot", `${(Math.random() - 0.5) * 900}deg`);
      b.style.animationDuration = `${3 + Math.random() * 3}s`;
      b.style.animationDelay = `${Math.random() * 1.2}s`;
      b.style.scale = String(0.6 + Math.random() * 0.8);
      doos.append(b);
    }
    setTimeout(() => doos.replaceChildren(), 7000);
  }

  /* ---------- wanneer & waar ---------- */

  function bouwTijdlijn() {
    const volgt = (tekst) => `<span class="volgt">${tekst}</span>`;
    const items = [
      {
        titel: "Kerkelijke trouw",
        uur: SITE.kerk.uur,
        tekst: SITE.kerk.locatie
          ? `${SITE.kerk.locatie}${SITE.kerk.adres ? `, ${SITE.kerk.adres}` : ""}`
          : volgt("Locatie volgt nog"),
      },
    ];
    if (isDinerGast) {
      items.push({
        titel: "Diner",
        uur: SITE.diner.uur,
        tekst: `${SITE.diner.locatie}, ${SITE.feest.gemeente}`,
      });
    }
    items.push({
      titel: "Feest",
      uur: SITE.feest.uur,
      tekst: `<a href="${SITE.feest.kaartLink}" target="_blank" rel="noopener">${SITE.feest.locatie}, ${SITE.feest.gemeente}</a>`,
    });

    const ol = $("#tijdlijn");
    items.forEach((it, i) => {
      const li = document.createElement("li");
      li.append(bloemSvg(i % 2 ? "madeliefje" : "bloem"));
      const div = document.createElement("div");
      div.innerHTML = `<h3>${it.titel}<span class="uur">${it.uur || ""}</span></h3>
        <p>${it.tekst}${it.uur ? "" : ` · ${volgt("uur volgt nog")}`}</p>`;
      li.append(div);
      ol.append(li);
    });

    const dagen = Math.ceil((new Date(`${SITE.datum.iso}T00:00:00`) - new Date()) / 864e5);
    $("#aftellen").textContent = dagen > 1
      ? `Nog ${dagen} nachtjes slapen`
      : dagen === 1 ? "Morgen is het zover!" : SITE.datum.lang;
  }

  /* ---------- agenda ---------- */

  const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  function bouwAgenda() {
    const a = SITE.agenda;
    const g = new URL("https://calendar.google.com/calendar/render");
    g.searchParams.set("action", "TEMPLATE");
    g.searchParams.set("text", a.titel);
    g.searchParams.set("dates", `${utc(a.start)}/${utc(a.einde)}`);
    g.searchParams.set("location", a.locatie);
    g.searchParams.set("details", `Save the date! De officiële uitnodiging volgt. ${location.href.split("?")[0]}`);
    $("#google-agenda").href = g.toString();

    $("#ics").addEventListener("click", () => {
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Amelie en Michiel//Save the date//NL",
        "BEGIN:VEVENT",
        `UID:std-${SITE.datum.iso}@amelie-michiel`,
        `DTSTAMP:${utc(new Date().toISOString())}`,
        `DTSTART:${utc(a.start)}`,
        `DTEND:${utc(a.einde)}`,
        `SUMMARY:${a.titel}`,
        `LOCATION:${a.locatie.replace(/,/g, "\\,")}`,
        "DESCRIPTION:Save the date! De officiële uitnodiging volgt.",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const link = Object.assign(document.createElement("a"), { href: url, download: "trouw-amelie-michiel.ics" });
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  /* ---------- formulier ---------- */

  function bouwFormulier() {
    const form = $("#formulier");
    const melding = $("#form-melding");

    $("#keuze-diner").hidden = !isDinerGast;
    if (!isDinerGast) form.diner.checked = false;

    const update = () => {
      const nee = form.aanwezig.value === "Helaas niet";
      $("#komt-blok").hidden = nee;
      $("#dieet-veld").hidden = !(isDinerGast && form.diner.checked && !nee);
    };
    form.addEventListener("change", update);
    update();

    form.addEventListener("input", (e) => e.target.classList.remove("ongeldig"));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      melding.textContent = "";
      form.querySelectorAll(".ongeldig").forEach((el) => el.classList.remove("ongeldig"));

      const fouten = [];
      if (!form.naam.value.trim()) { fouten.push("je naam"); form.naam.classList.add("ongeldig"); }
      if (!form.email.checkValidity() || !form.email.value) { fouten.push("een geldig e-mailadres"); form.email.classList.add("ongeldig"); }
      if (!form.aanwezig.value) { fouten.push("of je erbij bent"); form.querySelector(".keuzes").classList.add("ongeldig"); }
      if (fouten.length) {
        melding.textContent = `Vul nog ${fouten.join(", ")} in.`;
        form.querySelector(".ongeldig")?.focus();
        return;
      }

      if (!SITE.formulierUrl) {
        melding.textContent = "Het formulier is nog niet gekoppeld (formulierUrl in js/config.js is leeg).";
        return;
      }

      const komt = form.aanwezig.value !== "Helaas niet";
      const data = new URLSearchParams({
        naam: form.naam.value.trim(),
        email: form.email.value.trim(),
        aanwezig: form.aanwezig.value,
        aantal: komt ? form.aantal.value : "0",
        kerk: komt && form.kerk.checked ? "ja" : "",
        diner: komt && isDinerGast && form.diner.checked ? "ja" : "",
        feest: komt && form.feest.checked ? "ja" : "",
        dieet: komt && isDinerGast ? form.dieet.value.trim() : "",
        bericht: form.bericht.value.trim(),
        uitnodiging: isDinerGast ? "diner + feest" : "feest",
        quizscore: opslag.lees().klaar ? `${opslag.lees().score}/${QUIZ.length}` : "",
        website: form.website.value,
      });

      const knop = $("#verstuur");
      knop.disabled = true;
      knop.textContent = "Even geduld…";
      try {
        await verstuur(data);
        opslag.schrijf({ verstuurd: true });
        form.hidden = true;
        $("#bedankt-tekst").textContent = komt
          ? `We kijken er nu al naar uit, ${data.get("naam").split(/[ &]/)[0]}. De officiële uitnodiging volgt.`
          : "Jammer dat het niet lukt. Fijn dat je het ons laat weten!";
        $("#bedankt").hidden = false;
        $("#bedankt").focus();
      } catch {
        melding.textContent = "Er ging iets mis bij het versturen. Probeer het later nog eens of stuur ons een berichtje.";
      } finally {
        knop.disabled = false;
        knop.textContent = "Verstuur";
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

  bouwTijdlijn();
  bouwAgenda();
  bouwFormulier();

  $("#start").addEventListener("click", startQuiz);
  $("#overslaan").addEventListener("click", () => onthul(false));
  $("#opnieuw").addEventListener("click", startQuiz);
  $("#overslaan").hidden = !opslag.lees().klaar;
  voortgang.hidden = true;
})();
