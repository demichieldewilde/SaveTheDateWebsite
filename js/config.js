/*
 * ============================================================
 *  ALLES WAT JULLIE ZELF WILLEN AANPASSEN STAAT IN DIT BESTAND
 * ============================================================
 *  - Gegevens (datum, locaties, ...): in SITE hieronder.
 *  - Quizvragen: in QUIZ onderaan. Elke tekst staat in 4 talen: { nl, fr, en, de }.
 *    Ontbreekt een taal, dan wordt het Nederlands getoond.
 *  - Teksten van de knoppen, het formulier, ...: in js/teksten.js.
 *  - Foto's: zet een foto in fotos/ en verwijs ernaar als "fotos/naam.jpg".
 */

window.SITE = {
  namen: { een: "Amélie", twee: "Michiel" },

  datum: {
    iso: "2028-04-29",
    kort: "29 · 04 · 2028",
  },

  // Laat een veld leeg ("") en de site toont automatisch "volgt nog" in de juiste taal.
  kerk: {
    uur: "15:00",
    locatie: "",
  },
  // Het diner is enkel zichtbaar voor gasten met de dinerlink (zie dinerCode).
  diner: {
    uur: "",
    locatie: "Hof te Vitseroel",
  },
  feest: {
    uur: "",
    locatie: "Hof te Vitseroel",
    gemeente: "Ternat",
    kaartLink: "https://www.google.com/maps/search/?api=1&query=Hof+te+Vitseroel+Ternat",
  },

  // Voor de knoppen "Zet het in je agenda" (Belgische zomertijd, +02:00).
  agenda: {
    start: "2028-04-29T15:00:00+02:00",
    einde: "2028-04-30T02:00:00+02:00",
    locatie: "Hof te Vitseroel, Ternat",
  },

  // Gasten die op het diner uitgenodigd zijn, krijgen de link met ?k=<dinerCode>.
  // Zij zien het diner in "Wanneer & waar". Kiezen kunnen ze niet: dat beslissen jullie.
  dinerCode: "lente",

  // URL van jullie Google Apps Script (zie LEESMIJ.md, stap 2).
  formulierUrl: "",

  talen: ["nl", "fr", "en", "de"],
  standaardTaal: "nl",

  // Stijl van de site: "hoeve", "veldbloemen" of "blauwe-inkt".
  stijl: "hoeve",
  // Achtergrond: "standaard" (de kleur van de stijl), "lichtblauw" of "donkerblauw".
  achtergrond: "standaard",
  // Toont rechtsonder knopjes om stijl en achtergrond te wisselen. Zet op false voor de echte site.
  stijlKiezer: true,

  fotoKaart: "fotos/selfie-close-up.jpg",
};

/*
 * QUIZ
 * - fotos:      0, 1 of 2 foto's bij de vraag (geen foto = een illustratie)
 * - antwoorden: tekst  -> { nl: "...", fr: "...", ... }
 *               foto   -> { foto: "fotos/...", alt: { nl: "..." } }
 * - juist:      nummer van het juiste antwoord (0 = eerste), een lijst [0, 4] of "alle"
 * - uitleg:     te zien bij een fout antwoord
 * - bravo:      (optioneel) te zien bij een juist antwoord
 * In een vraag wordt {datum} vervangen door de trouwdatum in de juiste taal.
 */
window.QUIZ = [
  {
    vraag: {
      nl: "Een schilderij en een foto van dezelfde plek. Waar is dit?",
      fr: "Un tableau et une photo du même endroit. Où est-ce ?",
      en: "A painting and a photo of the same place. Where is this?",
      de: "Ein Gemälde und ein Foto vom selben Ort. Wo ist das?",
    },
    fotos: ["fotos/schilderij-nyhavn.jpg", "fotos/kopenhagen-nyhavn.jpg"],
    antwoorden: [
      { nl: "Amsterdam" },
      { nl: "Kopenhagen", fr: "Copenhague", en: "Copenhagen", de: "Kopenhagen" },
      { nl: "Bergen" },
      { nl: "Stockholm" },
    ],
    juist: 1,
    uitleg: {
      nl: "Kijk eens naar de gele gevel op het schilderij: Nyhavn 17. Dit is de oude haven van Kopenhagen.",
      fr: "Regardez la façade jaune sur le tableau : Nyhavn 17. C'est le vieux port de Copenhague.",
      en: "Take a look at the yellow facade in the painting: Nyhavn 17. This is the old harbour of Copenhagen.",
      de: "Schau dir die gelbe Fassade auf dem Gemälde an: Nyhavn 17. Das ist der alte Hafen von Kopenhagen.",
    },
    bravo: {
      nl: "Nyhavn, de oude haven van Kopenhagen.",
      fr: "Nyhavn, le vieux port de Copenhague.",
      en: "Nyhavn, the old harbour of Copenhagen.",
      de: "Nyhavn, der alte Hafen von Kopenhagen.",
    },
  },
  {
    vraag: {
      nl: "Waar at Michiel zijn allereerste Bretoense galette, in een Asterix-restaurant?",
      fr: "Où Michiel a-t-il mangé sa toute première galette bretonne, dans un restaurant Astérix ?",
      en: "Where did Michiel eat his very first Breton galette, in an Asterix restaurant?",
      de: "Wo hat Michiel seine allererste bretonische Galette gegessen, in einem Asterix-Restaurant?",
    },
    fotos: ["fotos/galettes-eten.jpg", "fotos/bord-la-galette.jpg"],
    antwoorden: [
      { nl: "Vannes" },
      { nl: "Saint-Malo" },
      { nl: "Parijs", fr: "Paris", en: "Paris", de: "Paris" },
      { nl: "Brussel", fr: "Bruxelles", en: "Brussels", de: "Brüssel" },
      { nl: "Londen", fr: "Londres", en: "London", de: "London" },
      { nl: "Kopenhagen", fr: "Copenhague", en: "Copenhagen", de: "Kopenhagen" },
      { nl: "Amsterdam" },
    ],
    juist: 5,
    uitleg: {
      nl: "Niet in Bretagne, maar in Kopenhagen, onder het waakzame oog van Asterix.",
      fr: "Pas en Bretagne, mais à Copenhague, sous l'œil vigilant d'Astérix.",
      en: "Not in Brittany, but in Copenhagen, under the watchful eye of Asterix.",
      de: "Nicht in der Bretagne, sondern in Kopenhagen, unter den wachsamen Augen von Asterix.",
    },
    bravo: {
      nl: "Inderdaad: niet in Bretagne, maar in Kopenhagen.",
      fr: "En effet : pas en Bretagne, mais à Copenhague.",
      en: "Indeed: not in Brittany, but in Copenhagen.",
      de: "Genau: nicht in der Bretagne, sondern in Kopenhagen.",
    },
  },
  {
    vraag: {
      nl: "Waar zijn Michiel en Amélie elkaar voor het eerst tegengekomen?",
      fr: "Où Michiel et Amélie se sont-ils rencontrés pour la première fois ?",
      en: "Where did Michiel and Amélie first meet?",
      de: "Wo sind sich Michiel und Amélie zum ersten Mal begegnet?",
    },
    fotos: [],
    antwoorden: [
      { nl: "Bosuil 2021" },
      { nl: "Wigwam 2020" },
      { nl: "KHL-weekend 2022", fr: "Week-end KHL 2022", en: "KHL weekend 2022", de: "KHL-Wochenende 2022" },
      { nl: "Roads to Narnia 2022" },
    ],
    juist: 0,
    uitleg: {
      nl: "Op Bosuil in 2021: Amélie kwam op de eind-SBT helpen om het kamp af te breken. In 2022 gingen we samen op KHL-weekend, maar daar spraken we niet met elkaar, want we hadden er zoveel andere vrienden. Pas op Roads to Narnia, waar we samen kampleiding waren, zijn we echt met elkaar beginnen praten.",
      fr: "À Bosuil en 2021 : Amélie est venue aider à démonter le camp. En 2022, nous sommes allés ensemble au week-end KHL, mais nous ne nous sommes pas parlé, tant il y avait d'autres amis. Ce n'est qu'à Roads to Narnia, où nous étions ensemble responsables du camp, que nous avons vraiment commencé à parler.",
      en: "At Bosuil in 2021: Amélie came to help take down the camp at the end. In 2022 we both went to the KHL weekend, but we didn't talk to each other because there were so many other friends. Only at Roads to Narnia, where we were camp leaders together, did we really start talking.",
      de: "Bei Bosuil 2021: Amélie kam am Ende, um beim Abbau des Lagers zu helfen. 2022 waren wir beide beim KHL-Wochenende, haben aber nicht miteinander gesprochen, weil dort so viele andere Freunde waren. Erst bei Roads to Narnia, wo wir zusammen Lagerleitung waren, haben wir wirklich angefangen zu reden.",
    },
    bravo: {
      nl: "Amélie kwam op de eind-SBT helpen om het Bosuil-kamp af te breken. Echt beginnen praten deden we pas op Roads to Narnia, waar we samen kampleiding waren.",
      fr: "Amélie est venue aider à démonter le camp Bosuil. Mais nous n'avons vraiment commencé à parler qu'à Roads to Narnia, où nous étions ensemble responsables du camp.",
      en: "Amélie came to help take down the Bosuil camp. We only really started talking at Roads to Narnia, where we were camp leaders together.",
      de: "Amélie kam, um beim Abbau des Bosuil-Lagers zu helfen. Richtig ins Gespräch kamen wir erst bei Roads to Narnia, wo wir zusammen Lagerleitung waren.",
    },
  },
  {
    vraag: {
      nl: "Waar heeft Amélie Michiel aan de haak geslagen?",
      fr: "Où Amélie a-t-elle ferré Michiel ?",
      en: "Where did Amélie get Michiel hooked?",
      de: "Wo hat Amélie Michiel an den Haken bekommen?",
    },
    fotos: ["fotos/vishaak-zomer.jpg"],
    antwoorden: [
      { nl: "Genève", fr: "Genève", en: "Geneva", de: "Genf" },
      { nl: "Montpellier" },
      { nl: "Vresse-sur-Semois" },
      { nl: "Brussel", fr: "Bruxelles", en: "Brussels", de: "Brüssel" },
      { nl: "Lac du Salagou" },
      { nl: "Wetteren" },
      { nl: "Wenen", fr: "Vienne", en: "Vienna", de: "Wien" },
    ],
    // twee juiste antwoorden: Genève (figuurlijk) en Lac du Salagou (letterlijk)
    juist: [0, 4],
    uitleg: {
      nl: "Figuurlijk in Genève, en letterlijk aan het Lac du Salagou. Kijk maar naar de foto!",
      fr: "Au sens figuré à Genève, et au sens propre au lac du Salagou. Regardez la photo !",
      en: "Figuratively in Geneva, and literally at the Lac du Salagou. Just look at the photo!",
      de: "Im übertragenen Sinn in Genf, und ganz wörtlich am Lac du Salagou. Schau dir nur das Foto an!",
    },
    bravo: {
      nl: "Figuurlijk in Genève, en letterlijk aan het Lac du Salagou.",
      fr: "Au sens figuré à Genève, et au sens propre au lac du Salagou.",
      en: "Figuratively in Geneva, and literally at the Lac du Salagou.",
      de: "Im übertragenen Sinn in Genf, und ganz wörtlich am Lac du Salagou.",
    },
  },
  {
    vraag: {
      nl: "En nu de hamvraag: wat doen wij op {datum}?",
      fr: "Et maintenant, la question à un million : que faisons-nous le {datum} ?",
      en: "And now the big question: what are we doing on {datum}?",
      de: "Und jetzt die alles entscheidende Frage: Was machen wir am {datum}?",
    },
    fotos: ["fotos/selfie-twijfelend.jpg"],
    antwoorden: [
      { nl: "Skiën in de Alpen", fr: "Skier dans les Alpes", en: "Skiing in the Alps", de: "Skifahren in den Alpen" },
      { nl: "Met de tandem naar Sète", fr: "Aller à Sète en tandem", en: "Riding the tandem to Sète", de: "Mit dem Tandem nach Sète" },
      { nl: "Trouwen!", fr: "Nous marier !", en: "Getting married!", de: "Heiraten!" },
      { nl: "Galettes eten in Kopenhagen", fr: "Manger des galettes à Copenhague", en: "Eating galettes in Copenhagen", de: "Galettes essen in Kopenhagen" },
    ],
    juist: 2,
    uitleg: {
      nl: "Dat zouden we ook graag doen, maar die dag zeggen we 'ja' tegen elkaar.",
      fr: "Ce serait chouette aussi, mais ce jour-là, nous nous disons « oui ».",
      en: "We'd love that too, but on that day we're saying 'I do'.",
      de: "Das würden wir auch gern machen, aber an diesem Tag sagen wir „Ja“ zueinander.",
    },
    bravo: {
      nl: "Die dag zeggen we 'ja' tegen elkaar.",
      fr: "Ce jour-là, nous nous disons « oui ».",
      en: "That day, we're saying 'I do'.",
      de: "An diesem Tag sagen wir „Ja“ zueinander.",
    },
  },
];
