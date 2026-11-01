/*
 * ============================================================
 *  ALLES WAT JULLIE ZELF WILLEN AANPASSEN STAAT IN DIT BESTAND
 * ============================================================
 *  - Teksten, data en locaties: in SITE hieronder.
 *  - Quizvragen: in QUIZ onderaan.
 *  - Foto's: zet een foto in de map fotos/ en verwijs ernaar als "fotos/naam.jpg".
 */

window.SITE = {
  namen: { een: "Amélie", twee: "Michiel" },

  datum: {
    iso: "2028-04-29",
    lang: "zaterdag 29 april 2028",
    kort: "29.04.2028",
  },

  // Laat een veld leeg ("") en de site toont automatisch "volgt nog".
  kerk: {
    uur: "15:00",
    locatie: "",
    adres: "",
  },
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

  // Voor de knop "Zet in je agenda" (tijden in Belgische zomertijd, +02:00).
  agenda: {
    titel: "Huwelijk Amélie & Michiel",
    start: "2028-04-29T15:00:00+02:00",
    einde: "2028-04-30T02:00:00+02:00",
    locatie: "Hof te Vitseroel, Ternat",
  },

  // Gasten die ook op het diner uitgenodigd zijn, krijgen de link met ?k=<dinerCode>
  // bv. https://<jullie-naam>.github.io/<repo>/?k=lente
  // Iedereen zonder die code ziet enkel de kerk en het feest.
  dinerCode: "lente",

  // Plak hier de URL van jullie Google Apps Script (zie LEESMIJ.md, stap 2).
  formulierUrl: "",

  fotoKaart: "fotos/selfie-close-up.jpg",
  fotoPostzegel: "fotos/strand-selfie-pet.jpg",
};

/*
 * QUIZ
 * - foto:       (optioneel) foto boven de vraag
 * - antwoorden: tekst  -> { tekst: "..." }
 *               foto   -> { foto: "fotos/...", alt: "beschrijving" }
 * - juist:      nummer van het juiste antwoord (0 = eerste), of "alle"
 * - uitleg:     wat mensen te zien krijgen als ze het mis hebben
 * - bravo:      (optioneel) extra zinnetje als het juist is
 */
window.QUIZ = [
  {
    vraag: "Eerste stempel in ons reisdagboek: waar staan we hier?",
    foto: "fotos/kopenhagen-nyhavn.jpg",
    antwoorden: [
      { tekst: "Amsterdam" },
      { tekst: "Kopenhagen" },
      { tekst: "Brugge" },
      { tekst: "Bergen" },
    ],
    juist: 1,
    uitleg: "Dit is Nyhavn in Kopenhagen: kleurige gevels, houten bootjes en veel te veel fietsen.",
    bravo: "Nyhavn, Kopenhagen. Goed gezien!",
  },
  {
    vraag: "Goed opgelet? Welke plek staat op dit schilderij?",
    foto: "fotos/schilderij-kleurrijke-huisjes.jpg",
    antwoorden: [
      { tekst: "Burano bij Venetië" },
      { tekst: "Sète in Zuid-Frankrijk" },
      { tekst: "Nyhavn in Kopenhagen" },
      { tekst: "Het centrum van Ternat" },
    ],
    juist: 2,
    uitleg: "Kijk nog eens naar de vorige foto: dezelfde gele, rode en blauwe huisjes aan het water. Het is Nyhavn.",
  },
  {
    vraag: "Op welke foto staan we vlak bij de Leeuw van Waterloo?",
    antwoorden: [
      { foto: "fotos/wandelen-dijk-silo.jpg", alt: "Wandelaar op een dijk naast een silo" },
      { foto: "fotos/leeuw-van-waterloo-selfie.jpg", alt: "Selfie op een grasheuvel met een beeld op de top" },
      { foto: "fotos/uitzicht-rivier-knuffel.jpg", alt: "Knuffel bij een uitzicht over een rivier" },
      { foto: "fotos/wandelen-selfie-zon.jpg", alt: "Selfie met rugzakken in de zon" },
    ],
    juist: 1,
    uitleg: "Zag je het beeldje op de heuvel achter ons? Dat is de Leeuw van Waterloo, 226 treden boven de slagvelden.",
  },
  {
    vraag: "Die letters verraden al veel. Maar in welk land ligt Sète?",
    foto: "fotos/sete-letters.jpg",
    antwoorden: [
      { tekst: "Italië" },
      { tekst: "Spanje" },
      { tekst: "Frankrijk" },
      { tekst: "Portugal" },
    ],
    juist: 2,
    uitleg: "Sète ligt aan de Middellandse Zee in Zuid-Frankrijk. Door de vele kanalen noemen ze het ook 'het Venetië van de Languedoc'.",
  },
  {
    vraag: "Wat ligt er hier op tafel?",
    foto: "fotos/galettes-eten.jpg",
    antwoorden: [
      { tekst: "Een pannenkoek met spiegelei" },
      { tekst: "Een galette complète" },
      { tekst: "Een croque madame" },
      { tekst: "Een pizza bianca" },
    ],
    juist: 1,
    uitleg: "Een galette: een hartige crêpe van boekweit met ham, kaas en een spiegelei. Met een fles cider erbij is het compleet.",
  },
  {
    vraag: "Welke foto vat ons het best samen?",
    antwoorden: [
      { foto: "fotos/onesies-spiegelselfie.jpg", alt: "Spiegelselfie in onesies" },
      { foto: "fotos/selfie-tong-uit.jpg", alt: "Selfie met de tong uit" },
      { foto: "fotos/kerstmutsen-duimen-omhoog.jpg", alt: "Kerstmutsen en duimen omhoog" },
      { foto: "fotos/zonnebrillen-jeep.jpg", alt: "Met zonnebrillen bij een jeep" },
    ],
    juist: "alle",
    bravo: "Een strikvraag: hier kon je niets fout doen.",
  },
  {
    vraag: "En nu de hamvraag: wat doen wij op zaterdag 29 april 2028?",
    antwoorden: [
      { tekst: "Skiën in de Alpen" },
      { tekst: "Met de tandem naar Sète" },
      { tekst: "Trouwen!" },
      { tekst: "Galettes eten tot we omvallen" },
    ],
    juist: 2,
    uitleg: "Dat zouden we ook graag doen, maar op 29 april 2028 zeggen we 'ja' tegen elkaar.",
    bravo: "Op 29 april 2028 zeggen we 'ja' tegen elkaar.",
  },
];
