/*
 * ============================================================
 *  ALLES WAT JULLIE ZELF WILLEN AANPASSEN STAAT IN DIT BESTAND
 * ============================================================
 *  - Gegevens (datum, locaties, ...): in SITE hieronder.
 *  - Quizvragen: in QUIZ onderaan. Elke tekst staat in 3 talen: { nl, fr, en }.
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
    kaartLink: "https://www.google.com/maps/search/?api=1&query=Hof+te+Vitseroel+Ternat",
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

  // Namen die het formulier voorstelt zodra een gast begint te typen (vrij typen blijft mogelijk).
  // Let op: deze lijst is voor iedereen zichtbaar in de broncode van de site.
  // Bijvoorbeeld: gasten: ["Jan & Marie Peeters", "Familie Janssens", "Sofie De Smet"],
  gasten: [],

  // URL van jullie Google Apps Script (zie LEESMIJ.md, stap 2).
  formulierUrl: "https://script.google.com/macros/s/AKfycbw07-yv4IfAx3tKt8QK0tlVOKSn98kyvr9oFRJByC4A71YRIvni3esXuzyx0Zl4GK1P/exec",

  talen: ["nl", "fr", "en"],
  standaardTaal: "nl",

  // Stijl van de site: "hoeve", "veldbloemen" of "blauwe-inkt".
  stijl: "hoeve",
  // Achtergrond: "standaard" (de kleur van de stijl), "lichtblauw" of "donkerblauw".
  achtergrond: "geel",
  // Toont rechtsonder knopjes om stijl en achtergrond te wisselen. Zet op false voor de echte site.
  stijlKiezer: false,

  fotoKaart: "fotos/zonnebrillen-jeep.jpg",
};

/*
 * QUIZ
 * - fotos:      0 tot 3 foto's bij de vraag (geen foto = een illustratie)
 * - video:      (optioneel) een filmpje in plaats van foto's
 * - fotoNa:     (optioneel) foto of kaartje dat pas na het antwoorden verschijnt
 * - kaart:      (optioneel) een kaart met pinnen in plaats van antwoorden.
 *               Elke pin: naam, lat, lon, juist: true (anders fout), tekst en fotos die na het tonen verschijnen.
 *               direct: true  -> een pin toont meteen of hij juist is (en de info) zodra je hem aantikt.
 *               namenTonen: true -> de namen staan altijd bij de pinnen.
 *               kant: "boven", "onder", "links" of "rechts" -> waar de naam naast de pin staat.
 * Bezoekers mogen altijd meerdere antwoorden aanduiden; juist = precies de juiste aangeduid.
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
      nl: "Waar zijn we elkaar voor het eerst tegengekomen?",
      fr: "Où nous sommes-nous rencontrés pour la première fois ?",
      en: "Where did we first meet?",
    },
    fotos: ["fotos/groepsselfie-rivier.jpg", "fotos/houten-troon-kamp.jpg"],
    antwoorden: [
      { nl: "Bosuil 2021" },
      { nl: "Wigwam 2020" },
      { nl: "KHL-weekend 2022", fr: "Week-end KHL 2022", en: "KHL weekend 2022" },
      { nl: "Roads to Narnia 2022" },
    ],
    juist: 0,
    uitleg: {
      nl: "In augustus 2021 ging Michiel mee op het Bizonkamp Bosuil. Amélie kwam op het einde van dat kamp helpen om het materiaal terug naar ons depot te brengen, oftewel de Kribbe. Buiten \"Hoe was het kamp?\" hebben we niet veel met elkaar gesproken.",
      fr: "En août 2021, Michiel est parti au camp Bizon Bosuil. À la fin de ce camp, Amélie est venue aider à ramener le matériel à notre dépôt. À part « C'était comment, le camp ? », on ne s'est pas dit grand-chose.",
      en: "In August 2021, Michiel went along on the Bizon camp Bosuil. At the end of that camp, Amélie came to help bring the gear back to our depot, a.k.a. the Kribbe. Apart from \"How was camp?\", we didn't say much to each other.",
    },
    bravo: {
      nl: "In augustus 2021 ging Michiel mee op het Bizonkamp Bosuil. Amélie kwam op het einde van dat kamp helpen om het materiaal terug naar ons depot te brengen, oftewel de Kribbe. Buiten \"Hoe was het kamp?\" hebben we niet veel met elkaar gesproken.",
      fr: "En août 2021, Michiel est parti au camp Bizon Bosuil. À la fin de ce camp, Amélie est venue aider à ramener le matériel à notre dépôt. À part « C'était comment, le camp ? », on ne s'est pas dit grand-chose.",
      en: "In August 2021, Michiel went along on the Bizon camp Bosuil. At the end of that camp, Amélie came to help bring the gear back to our depot, a.k.a. the Kribbe. Apart from \"How was camp?\", we didn't say much to each other.",
    },
  },
  {
    vraag: {
      nl: "En waar hebben we elkaar echt leren kennen?",
      fr: "Et où avons-nous vraiment appris à nous connaître ?",
      en: "And where did we really get to know each other?",
    },
    fotos: ["fotos/kamp-bijl-en-moker.jpg", "fotos/groepsfoto-park-zonsondergang.jpg"],
    antwoorden: [
      { nl: "Troubles at the North Pole 2022" },
      { nl: "Wigwam 2020" },
      { nl: "KHL-weekend 2022", fr: "Week-end KHL 2022", en: "KHL weekend 2022" },
      { nl: "Roads to Narnia 2022" },
    ],
    juist: 3,
    uitleg: {
      nl: "In de zomer van 2022 werden we last minute door het lot samengebracht om samen kampleiding te zijn van het kamp Roads to Narnia. Tijdens de (heel) korte voorbereiding en het kamp leerden we elkaar echt kennen. Dat jaar waren we al samen met de andere kamp- en hoofdleidingen van Bizon op weekend geweest, maar die kans om elkaar te leren kennen hadden we niet benut. In 2023 besloten we om nog eens samen kampleiding te zijn, voor het kamp Troubles at the North Pole.",
      fr: "En juillet 2022, le hasard nous a réunis à la dernière minute pour diriger ensemble le camp Roads to Narnia. Pendant la (très) courte préparation et le camp, nous avons vraiment appris à nous connaître. Cette année-là, nous étions déjà partis en week-end avec les autres responsables de camp et chefs de Bizon, mais nous n'avions pas saisi l'occasion de faire connaissance. En 2023, nous avons décidé de diriger à nouveau un camp ensemble : Troubles at the North Pole.",
      en: "In the summer of 2022, fate brought us together at the last minute to lead the Roads to Narnia camp together. During the (very) short preparation and the camp itself, we really got to know each other. That year we had already been on a weekend away with Bizon's other camp and head leaders, but we hadn't used that chance to get to know each other. In 2023 we decided to lead a camp together once more: Troubles at the North Pole.",
    },
    bravo: {
      nl: "In de zomer van 2022 werden we last minute door het lot samengebracht om samen kampleiding te zijn van het kamp Roads to Narnia. Tijdens de (heel) korte voorbereiding en het kamp leerden we elkaar echt kennen. Dat jaar waren we al samen met de andere kamp- en hoofdleidingen van Bizon op weekend geweest, maar die kans om elkaar te leren kennen hadden we niet benut. In 2023 besloten we om nog eens samen kampleiding te zijn, voor het kamp Troubles at the North Pole.",
      fr: "En juillet 2022, le hasard nous a réunis à la dernière minute pour diriger ensemble le camp Roads to Narnia. Pendant la (très) courte préparation et le camp, nous avons vraiment appris à nous connaître. Cette année-là, nous étions déjà partis en week-end avec les autres responsables de camp et chefs de Bizon, mais nous n'avions pas saisi l'occasion de faire connaissance. En 2023, nous avons décidé de diriger à nouveau un camp ensemble : Troubles at the North Pole.",
      en: "In the summer of 2022, fate brought us together at the last minute to lead the Roads to Narnia camp together. During the (very) short preparation and the camp itself, we really got to know each other. That year we had already been on a weekend away with Bizon's other camp and head leaders, but we hadn't used that chance to get to know each other. In 2023 we decided to lead a camp together once more: Troubles at the North Pole.",
    },
    fotoNa: {
      foto: "fotos/khl-weekend-strand.jpg",
      alt: { nl: "Groepsfoto op het strand tijdens het KHL-weekend", fr: "Photo de groupe sur la plage pendant le week-end KHL", en: "Group photo on the beach during the KHL weekend" },
      bijschrift: { nl: "(KHL-weekend 2022)", fr: "(week-end KHL 2022)", en: "(KHL weekend 2022)" },
    },
  },
  {
    vraag: {
      nl: "Waar heeft Amélie Michiel aan de haak geslagen?",
      fr: "Où Michiel a-t-il mordu à l'hameçon d'Amélie ?",
      en: "Where did Amélie get Michiel hooked?",
    },
    fotos: ["fotos/vishaak-zomer.jpg"],
    antwoorden: [
      { nl: "Genève", fr: "Genève", en: "Geneva" },
      { nl: "Montpellier" },
      { nl: "Vresse-sur-Semois" },
      { nl: "Brussel", fr: "Bruxelles", en: "Brussels" },
      { nl: "Lac du Salagou" },
      { nl: "Wetteren" },
      { nl: "Wenen", fr: "Vienne", en: "Vienna" },
    ],
    // twee juiste antwoorden: Genève (figuurlijk) en Lac du Salagou (letterlijk)
    juist: [0, 4],
    uitleg: {
      nl: "Tijdens onze reis naar de Hérault in Frankrijk (2024) lag er in het Lac du Salagou een oude vishaak die zich vastzette in Amélies waterschoen, waarmee ze tijdens een watergevecht per ongeluk tegen Michiel trapte. Figuurlijk begon ons verhaal al in 2022, in Genève.",
      fr: "Pendant notre voyage dans l'Hérault (2024), un vieil hameçon traînait dans le lac du Salagou et s'est accroché à la chaussure aquatique d'Amélie, avec laquelle elle a donné par accident un coup de pied à Michiel pendant une bataille d'eau. Au sens figuré, notre histoire avait déjà commencé en 2022, à Genève.",
      en: "During our trip to the Hérault in France (2024), an old fishing hook in the Lac du Salagou got stuck in Amélie's water shoe, which she then accidentally kicked Michiel with during a water fight. Figuratively, our story had already begun in 2022, in Geneva.",
    },
    bravo: {
      nl: "Tijdens onze reis naar de Hérault in Frankrijk (2024) lag er in het Lac du Salagou een oude vishaak die zich vastzette in Amélies waterschoen, waarmee ze tijdens een watergevecht per ongeluk tegen Michiel trapte. Figuurlijk begon ons verhaal al in 2022, in Genève.",
      fr: "Pendant notre voyage dans l'Hérault (2024), un vieil hameçon traînait dans le lac du Salagou et s'est accroché à la chaussure aquatique d'Amélie, avec laquelle elle a donné par accident un coup de pied à Michiel pendant une bataille d'eau. Au sens figuré, notre histoire avait déjà commencé en 2022, à Genève.",
      en: "During our trip to the Hérault in France (2024), an old fishing hook in the Lac du Salagou got stuck in Amélie's water shoe, which she then accidentally kicked Michiel with during a water fight. Figuratively, our story had already begun in 2022, in Geneva.",
    },
  },
  {
    vraag: {
      nl: "Wat gingen we doen in Genève?",
      fr: "Qu'allions-nous faire à Genève ?",
      en: "What took us to Geneva?",
    },
    fotos: ["fotos/geneve-kathedraal-regen-wijzen.jpg", "fotos/geneve-haven-gele-jas.jpg", "fotos/selfie-kamer-serieus.jpg"],
    antwoorden: [
      { nl: "Michiel wou de LHC bezoeken", fr: "Michiel voulait visiter le LHC", en: "Michiel wanted to visit the LHC" },
      { nl: "Amélie was er op Erasmus", fr: "Amélie y était en Erasmus", en: "Amélie was there on Erasmus" },
      { nl: "Michiel wou er Ovomaltine-chocolade halen", fr: "Michiel voulait y acheter du chocolat Ovomaltine", en: "Michiel wanted to buy Ovomaltine chocolate there" },
      { nl: "Amélie wou de kerstmarkt daar bezoeken", fr: "Amélie voulait visiter le marché de Noël là-bas", en: "Amélie wanted to visit the Christmas market there" },
    ],
    juist: 1,
    uitleg: {
      nl: "Amélie zat in Genève op Erasmus.",
      fr: "Amélie était en Erasmus à Genève.",
      en: "Amélie was on Erasmus in Geneva.",
    },
    bravo: {
      nl: "Amélie zat in Genève op Erasmus.",
      fr: "Amélie était en Erasmus à Genève.",
      en: "Amélie was on Erasmus in Geneva.",
    },
    fotoNa: {
      foto: "fotos/video-disco-geneve.mp4",
      alt: { nl: "Disco dansen in Genève", fr: "Danser en discothèque à Genève", en: "Disco dancing in Geneva" },
    },
  },
  {
    vraag: {
      nl: "Amélies familie komt gedeeltelijk uit Bretagne, waar het traditie is om Bretoense galettes te eten. Waar at Michiel zijn allereerste Bretoense galette?",
      fr: "La famille d'Amélie vient en partie de Bretagne, où la tradition est de manger des galettes bretonnes. Où Michiel a-t-il mangé sa toute première galette bretonne ?",
      en: "Part of Amélie's family comes from Brittany, where eating Breton galettes is a tradition. Where did Michiel eat his very first Breton galette?",
    },
    fotos: ["fotos/galettes-eten.jpg", "fotos/bord-la-galette.jpg"],
    antwoorden: [
      { nl: "Vannes" },
      { nl: "Saint-Malo" },
      { nl: "Parijs", fr: "Paris", en: "Paris" },
      { nl: "Brussel", fr: "Bruxelles", en: "Brussels" },
      { nl: "Kopenhagen", fr: "Copenhague", en: "Copenhagen" },
      { nl: "Amsterdam" },
    ],
    juist: 4,
    uitleg: {
      nl: "Tijdens onze trektocht door Duitsland en Denemarken in 2023 kwamen we bij onze stop in Kopenhagen een crêperie in Asterix-thema tegen. Die kans konden we niet laten liggen om Michiel kennis te laten maken met hartige pannenkoeken.",
      fr: "Pendant notre trek à travers l'Allemagne et le Danemark en 2023, nous sommes tombés, lors de notre étape à Copenhague, sur une crêperie sur le thème d'Astérix. Impossible de laisser passer l'occasion de faire découvrir les crêpes salées à Michiel.",
      en: "During our trek through Germany and Denmark in 2023, we came across an Asterix-themed crêperie during our stop in Copenhagen. We couldn't pass up the chance to introduce Michiel to savoury pancakes.",
    },
    bravo: {
      nl: "Tijdens onze trektocht door Duitsland en Denemarken in 2023 kwamen we bij onze stop in Kopenhagen een crêperie in Asterix-thema tegen. Die kans konden we niet laten liggen om Michiel kennis te laten maken met hartige pannenkoeken.",
      fr: "Pendant notre trek à travers l'Allemagne et le Danemark en 2023, nous sommes tombés, lors de notre étape à Copenhague, sur une crêperie sur le thème d'Astérix. Impossible de laisser passer l'occasion de faire découvrir les crêpes salées à Michiel.",
      en: "During our trek through Germany and Denmark in 2023, we came across an Asterix-themed crêperie during our stop in Copenhagen. We couldn't pass up the chance to introduce Michiel to savoury pancakes.",
    },
  },
  {
    vraag: {
      nl: "Waarom wonen we nu in Oostenrijk?",
      fr: "Pourquoi habitons-nous maintenant en Autriche ?",
      en: "Why do we live in Austria now?",
    },
    fotos: ["fotos/oostenrijk-deur.jpg", "fotos/paleis-cascade-fontein.jpg", "fotos/uitzicht-rivier-knuffel.jpg"],
    antwoorden: [
      { nl: "Amélie wil ergens wonen met minstens 14 kerstmarkten per jaar", fr: "Amélie veut vivre quelque part avec au moins 14 marchés de Noël par an", en: "Amélie wants to live somewhere with at least 14 Christmas markets a year" },
      { nl: "Michiel doet er zijn doctoraat", fr: "Michiel y fait son doctorat", en: "Michiel is doing his PhD there" },
      { nl: "We willen de hele Donau afkajakken en affietsen", fr: "Nous voulons descendre tout le Danube en kayak et à vélo", en: "We want to kayak and cycle the whole Danube" },
      { nl: "We komen hier gewoon even de lokale keuken uitproberen", fr: "Nous sommes juste venus goûter la cuisine locale", en: "We just came to try out the local cuisine" },
    ],
    juist: 1,
    uitleg: {
      nl: "We zijn naar Oostenrijk vertrokken zodat Michiel een doctoraat kon maken aan het Institute of Science and Technology Austria.",
      fr: "Nous sommes partis en Autriche pour que Michiel puisse faire un doctorat à l'Institute of Science and Technology Austria.",
      en: "We moved to Austria so that Michiel could do a PhD at the Institute of Science and Technology Austria.",
    },
    fotoNa: {
      foto: "fotos/schneeberg-top.jpg",
      alt: { nl: "Wij met vrienden op de top van de Schneeberg", fr: "Nous avec des amis au sommet du Schneeberg", en: "Us with friends on top of the Schneeberg" },
    },
  },
  {
    vraag: {
      nl: "In welk district van Wenen wonen we?",
      fr: "Dans quel arrondissement de Vienne habitons-nous ?",
      en: "In which district of Vienna do we live?",
    },
    fotos: ["fotos/verhuisdozen.jpg"],
    antwoorden: [
      { nl: "1e: Innere Stadt", fr: "1er : Innere Stadt", en: "1st: Innere Stadt" },
      { nl: "2e: Leopoldstadt", fr: "2e : Leopoldstadt", en: "2nd: Leopoldstadt" },
      { nl: "7e: Neubau", fr: "7e : Neubau", en: "7th: Neubau" },
      { nl: "9e: Alsergrund", fr: "9e : Alsergrund", en: "9th: Alsergrund" },
      { nl: "20e: Brigittenau", fr: "20e : Brigittenau", en: "20th: Brigittenau" },
    ],
    juist: 4,
    uitleg: {
      nl: "We wonen in het 20e district: Brigittenau, tussen de Donau en het Donaukanal.",
      fr: "Nous habitons dans le 20e arrondissement : Brigittenau, entre le Danube et le canal du Danube.",
      en: "We live in the 20th district: Brigittenau, between the Danube and the Danube Canal.",
    },
    bravo: {
      nl: "Het 20e district: Brigittenau, tussen de Donau en het Donaukanal.",
      fr: "Le 20e arrondissement : Brigittenau, entre le Danube et le canal du Danube.",
      en: "The 20th district: Brigittenau, between the Danube and the Danube Canal.",
    },
    fotoNa: {
      foto: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Vienna%2C_administrative_divisions_-_Nmbrs.svg",
      alt: { nl: "Kaart van de 23 districten van Wenen", fr: "Carte des 23 arrondissements de Vienne", en: "Map of the 23 districts of Vienna" },
      bijschrift: {
        nl: "De 23 districten van Wenen. Kaart: TUBS, CC BY-SA 3.0, via Wikimedia Commons",
        fr: "Les 23 arrondissements de Vienne. Carte : TUBS, CC BY-SA 3.0, via Wikimedia Commons",
        en: "The 23 districts of Vienna. Map: TUBS, CC BY-SA 3.0, via Wikimedia Commons",
      },
    },
  },
  {
    vraag: {
      nl: "Wie won het pingpongkampioenschap tijdens de januari-examens van 2024?",
      fr: "Qui a remporté le championnat de ping-pong pendant les examens de janvier 2024 ?",
      en: "Who won the ping-pong championship during the January 2024 exams?",
    },
    fotos: [],
    antwoorden: [{ nl: "Amélie" }, { nl: "Michiel" }],
    juist: 0,
    uitleg: {
      nl: "Amélie, en ze kreeg toen de kroon van winnaar van dat jaar. (Vraag maar niet van wie.)",
      fr: "Amélie, et elle a reçu la couronne de la gagnante de l'année. (Mieux vaut ne pas demander de qui elle la tient.)",
      en: "Amélie, and she got that year's winner's crown. (Don't ask who she got it from.)",
    },
    bravo: {
      nl: "Amélie, en ze kreeg toen de kroon van winnaar van dat jaar. (Vraag maar niet van wie.)",
      fr: "Amélie, et elle a reçu la couronne de la gagnante de l'année. (Mieux vaut ne pas demander de qui elle la tient.)",
      en: "Amélie, and she got that year's winner's crown. (Don't ask who she got it from.)",
    },
    fotoNa: {
      foto: "fotos/pingpong-koksmuts.jpg",
      alt: { nl: "Amélie met pingpongbatje en koksmuts", fr: "Amélie avec une raquette de ping-pong et une toque", en: "Amélie with a ping-pong bat and a chef's hat" },
    },
  },
  {
    vraag: {
      nl: "In welke winkel, waar Amélie altijd haar beste snufjes vond, werkt ze nu?",
      fr: "Dans quel magasin, où Amélie dénichait toujours ses meilleures trouvailles, travaille-t-elle maintenant ?",
      en: "Which shop, where Amélie always found her best gadgets, does she work at now?",
    },
    fotos: ["fotos/roze-zwembril.jpg"],
    antwoorden: [
      { nl: "Decathlon" },
      { nl: "IKEA" },
      { nl: "Dille & Kamille" },
      { nl: "HEMA" },
    ],
    juist: 0,
    uitleg: {
      nl: "Amélie werkt sinds oktober 2026 bij Decathlon Floridsdorf, waar ze elke dag haar beste Duits bovenhaalt 😉",
      fr: "Depuis octobre 2026, Amélie travaille chez Decathlon Floridsdorf, où elle sort chaque jour son meilleur allemand 😉",
      en: "Since October 2026, Amélie has been working at Decathlon Floridsdorf, where she gets out her best German every day 😉",
    },
    bravo: {
      nl: "Amélie werkt sinds oktober 2026 bij Decathlon Floridsdorf, waar ze elke dag haar beste Duits bovenhaalt 😉",
      fr: "Depuis octobre 2026, Amélie travaille chez Decathlon Floridsdorf, où elle sort chaque jour son meilleur allemand 😉",
      en: "Since October 2026, Amélie has been working at Decathlon Floridsdorf, where she gets out her best German every day 😉",
    },
  },
  {
    vraag: {
      nl: "Hoe heten onze broers en zussen?",
      fr: "Comment s'appellent nos frères et sœurs ?",
      en: "What are the names of our brothers and sisters?",
    },
    fotos: [],
    antwoorden: [
      { nl: "Julie, Simon, Quentin en Marie", fr: "Julie, Simon, Quentin et Marie", en: "Julie, Simon, Quentin and Marie" },
      { nl: "Jolien, Simon, Corentin en Marine", fr: "Jolien, Simon, Corentin et Marine", en: "Jolien, Simon, Corentin and Marine" },
      { nl: "Joke, Sam, Corentin en Martine", fr: "Joke, Sam, Corentin et Martine", en: "Joke, Sam, Corentin and Martine" },
      { nl: "Jolien, Stijn, Coralie en Marine", fr: "Jolien, Stijn, Coralie et Marine", en: "Jolien, Stijn, Coralie and Marine" },
    ],
    juist: 1,
    uitleg: {
      nl: "Jolien en Simon zijn de zus en broer van Michiel, Corentin en Marine de broer en zus van Amélie.",
      fr: "Jolien et Simon sont la sœur et le frère de Michiel, Corentin et Marine le frère et la sœur d'Amélie.",
      en: "Jolien and Simon are Michiel's sister and brother, Corentin and Marine are Amélie's brother and sister.",
    },
  },
  {
    vraag: {
      nl: "Hoeveel neven en nichten heeft Michiel?",
      fr: "Combien de cousins et cousines Michiel a-t-il ?",
      en: "How many cousins does Michiel have?",
    },
    fotos: ["fotos/koken-houten-keuken.jpg", "fotos/skien-groepsfoto.jpg"],
    antwoorden: [{ nl: "4" }, { nl: "8" }, { nl: "12" }, { nl: "16" }, { nl: "20" }],
    juist: 2,
    uitleg: {
      nl: "Michiel heeft langs beide kanten 6 neven en nichten, samen dus 12.",
      fr: "Michiel a 6 cousins et cousines de chaque côté, donc 12 en tout.",
      en: "Michiel has 6 cousins on each side, so 12 in total.",
    },
  },
  {
    vraag: {
      nl: "En hoeveel neven en nichten heeft Amélie?",
      fr: "Et combien de cousins et cousines Amélie a-t-elle ?",
      en: "And how many cousins does Amélie have?",
    },
    fotos: [],
    antwoorden: [{ nl: "2" }, { nl: "4" }, { nl: "6" }, { nl: "8" }, { nl: "10" }],
    juist: 2,
    uitleg: {
      nl: "Amélie heeft 6 neven en nichten. Ze heeft 2 nichten langs papa's kant en 6 neven en nichten langs mama's kant. (Ja hoor, je berekening klopt. Maar hoe kan het dan dat het juiste antwoord toch 6 is?)",
      fr: "Amélie a 6 cousins et cousines. Elle a 2 cousines du côté de son papa et 6 cousins et cousines du côté de sa maman. (Oui, oui, ton calcul est juste. Mais alors, comment se fait-il que la bonne réponse soit quand même 6 ?)",
      en: "Amélie has 6 cousins. She has 2 cousins on her dad's side and 6 cousins on her mum's side. (Yes, your maths is right. So how can the right answer still be 6?)",
    },
  },
  {
    vraag: {
      nl: "Wie van ons twee draagt de broek?",
      fr: "Qui de nous deux porte la culotte ?",
      en: "Which of us wears the trousers?",
    },
    fotos: ["fotos/tafel-rode-muur.jpg"],
    antwoorden: [{ nl: "Michiel" }, { nl: "Amélie" }],
    juist: 1,
    uitleg: {
      nl: "We komen er samen vaak uit, maar als het moet, dan Amélie ;)",
      fr: "Nous trouvons souvent une solution ensemble, mais s'il le faut, c'est Amélie ;)",
      en: "We usually work it out together, but if push comes to shove, it's Amélie ;)",
    },
    bravo: {
      nl: "We komen er samen vaak uit, maar als het moet, dan Amélie ;)",
      fr: "Nous trouvons souvent une solution ensemble, mais s'il le faut, c'est Amélie ;)",
      en: "We usually work it out together, but if push comes to shove, it's Amélie ;)",
    },
  },
  {
    vraag: {
      nl: "We zijn allebei veel sociale engagementen aangegaan. Wat waren die van Amélie door de jaren heen?",
      fr: "Nous nous sommes tous les deux beaucoup engagés socialement. Quels ont été les engagements d'Amélie au fil des ans ?",
      en: "We've both taken on lots of social commitments. What were Amélie's over the years?",
    },
    fotos: ["fotos/sporthal-medaille.jpg", "fotos/klimgordels.jpg"],
    antwoorden: [
      { nl: "Kringwerking Tegenstroom, Ontmoetingsdagen en Pagadderke", fr: "Kringwerking Tegenstroom, Ontmoetingsdagen et Pagadderke", en: "Kringwerking Tegenstroom, Ontmoetingsdagen and Pagadderke" },
      { nl: "Bizon vzw, Théâtre Universitaire de Louvain en IncluKap", fr: "Bizon vzw, Théâtre Universitaire de Louvain et IncluKap", en: "Bizon vzw, Théâtre Universitaire de Louvain and IncluKap" },
      { nl: "Chiro, Rode Kruis en IncluKap", fr: "Chiro, Croix-Rouge et IncluKap", en: "Chiro, Red Cross and IncluKap" },
      { nl: "KSA, Théâtre Universitaire de Louvain en Oxfam", fr: "KSA, Théâtre Universitaire de Louvain et Oxfam", en: "KSA, Théâtre Universitaire de Louvain and Oxfam" },
    ],
    juist: 1,
    uitleg: {
      nl: "Amélie is sinds 2016 actief bij Bizon vzw. Doorheen de jaren heeft ze daar verschillende functies en taken opgenomen: ze begon als animator en werd nadien hoofdanimator, schreef mee aan de beleidsnota, organiseerde ontmoetingen, was bestuurder en lid van de Algemene Vergadering, en volgde de communicatie en de vormgeving op. Tijdens haar master in Louvain-la-Neuve was ze ook lid van kotprojecten zoals het Théâtre Universitaire de Louvain, waar ze een theaterfestival en andere evenementen rond amateurtheater organiseerde. Haar laatste semester engageerde ze zich bij IncluKap, dat activiteiten organiseert om studenten en mensen met een mentale beperking samen te brengen en sport mogelijk te maken voor studenten met een fysieke beperking.",
      fr: "Amélie est active chez Bizon vzw depuis 2016. Au fil des ans, elle y a assumé différentes fonctions et tâches : elle a commencé comme animatrice, puis est devenue animatrice principale, a participé à la rédaction de la note de politique, organisé des rencontres, été administratrice et membre de l'Assemblée générale, et suivi la communication et la mise en page. Pendant son master à Louvain-la-Neuve, elle a aussi fait partie de kots-à-projet comme le Théâtre Universitaire de Louvain, où elle a organisé un festival de théâtre et d'autres événements autour du théâtre amateur. Lors de son dernier semestre, elle s'est engagée chez IncluKap, qui organise des activités pour rassembler des étudiants et des personnes ayant une déficience intellectuelle, et pour rendre le sport accessible aux étudiants ayant un handicap physique.",
      en: "Amélie has been active at Bizon vzw since 2016. Over the years she has taken on many roles there: she started as a youth leader, then became head leader, helped write the policy plan, organised get-togethers, served as a board member and member of the General Assembly, and looked after communication and design. During her master's in Louvain-la-Neuve she was also part of student project houses such as the Théâtre Universitaire de Louvain, where she organised a theatre festival and other amateur theatre events. In her last semester she got involved with IncluKap, which organises activities that bring students together with people with an intellectual disability and makes sport possible for students with a physical disability.",
    },
  },
  {
    vraag: {
      nl: "En wat zijn de sociale engagementen van Michiel?",
      fr: "Et quels sont les engagements sociaux de Michiel ?",
      en: "And what are Michiel's social commitments?",
    },
    video: "fotos/video-verkleed-dansje-kamp.mp4",
    antwoorden: [
      { nl: "Kringwerking Tegenstroom, Chiro, Bizon vzw en Scouts", fr: "Kringwerking Tegenstroom, Chiro, Bizon vzw et Scouts", en: "Kringwerking Tegenstroom, Chiro, Bizon vzw and Scouts" },
      { nl: "Théâtre Universitaire, Ontmoetingsdagen en IncluKap", fr: "Théâtre Universitaire, Ontmoetingsdagen et IncluKap", en: "Théâtre Universitaire, Ontmoetingsdagen and IncluKap" },
      { nl: "Kringwerking Tegenstroom, Ontmoetingsdagen, Bizon vzw en Pagadderke", fr: "Kringwerking Tegenstroom, Ontmoetingsdagen, Bizon vzw et Pagadderke", en: "Kringwerking Tegenstroom, Ontmoetingsdagen, Bizon vzw and Pagadderke" },
      { nl: "Studentenraad, Ontmoetingsdagen, KSA en Pagadderke", fr: "Conseil étudiant, Ontmoetingsdagen, KSA et Pagadderke", en: "Student council, Ontmoetingsdagen, KSA and Pagadderke" },
    ],
    juist: 2,
    uitleg: {
      nl: "Kringwerking Tegenstroom, Ontmoetingsdagen, Bizon vzw en Pagadderke. Het zijn alle vier jeugdwerkorganisaties: de laatste drie geven kampen, en de laatste twee richten zich op jongeren in maatschappelijk kwetsbare situaties.",
      fr: "Kringwerking Tegenstroom, Ontmoetingsdagen, Bizon vzw et Pagadderke. Ce sont quatre organisations de jeunesse : les trois dernières organisent des camps, et les deux dernières s'adressent aux jeunes en situation de vulnérabilité sociale.",
      en: "Kringwerking Tegenstroom, Ontmoetingsdagen, Bizon vzw and Pagadderke. All four are youth work organisations: the last three run camps, and the last two work with young people in socially vulnerable situations.",
    },
  },
  {
    vraag: {
      nl: "Wat zijn onze gemeenschappelijke hobby's?",
      fr: "Quels sont nos hobbys communs ?",
      en: "What hobbies do we share?",
    },
    fotos: ["fotos/romeinen-lauwerkrans.jpg"],
    antwoorden: [
      { nl: "Improvisatietheater", fr: "Le théâtre d'improvisation", en: "Improv theatre" },
      { nl: "Romeinse re-enactment", fr: "La reconstitution romaine", en: "Roman re-enactment" },
      { nl: "Koken", fr: "La cuisine", en: "Cooking" },
      { nl: "Onnozel doen om de wereld te verbeteren", fr: "Faire les fous pour rendre le monde meilleur", en: "Being silly to make the world a better place" },
    ],
    // drie juiste antwoorden: alles behalve de Romeinen
    juist: [0, 2, 3],
    uitleg: {
      nl: "We hebben allebei in een bepaalde periode van ons leven improvisatietheater gespeeld en gaan er ook graag naar kijken. We koken en bakken heel graag. En een groot deel van ons leven bestaat erin het beste van onszelf te geven om kinderen en jongeren uit een maatschappelijk kwetsbare situatie de tijd van hun leven te geven.",
      fr: "Nous avons tous les deux fait du théâtre d'improvisation à un moment de notre vie, et nous aimons aussi aller en voir. Nous adorons cuisiner et faire de la pâtisserie. Et une grande partie de notre vie consiste à donner le meilleur de nous-mêmes pour offrir à des enfants et des jeunes en situation de vulnérabilité sociale les plus beaux moments de leur vie.",
      en: "We've both done improv theatre at some point in our lives, and we love going to watch it too. We love cooking and baking. And a big part of our lives is giving the best of ourselves so that children and young people from socially vulnerable situations can have the time of their lives.",
    },
  },
  {
    vraag: {
      nl: "Waar zijn we samen al geweest? Duid alle landen aan, maar pas op voor de pinnen waar we nog niet waren!",
      fr: "Où sommes-nous déjà allés ensemble ? Sélectionne tous les pays, mais attention aux épingles où nous ne sommes pas encore allés !",
      en: "Where have we been together? Select all the countries, but watch out for the pins where we haven't been yet!",
    },
    kaart: {
      direct: true,
      pinnen: [
        {
          naam: { nl: "Duitsland", fr: "Allemagne", en: "Germany" },
          lat: 51.1, lon: 10.4, juist: true,
          tekst: {
            nl: "We trokken naar het noorden van Duitsland tijdens onze trektocht in 2023.",
            fr: "Nous avons traversé l'Allemagne vers le nord pendant notre trek de 2023.",
            en: "We headed to the north of Germany during our 2023 trek.",
          },
          fotos: ["fotos/tandem-fiets.jpg", "fotos/pasta-eten.jpg", "fotos/wandelen-dijk-silo.jpg"],
        },
        {
          naam: { nl: "Denemarken", fr: "Danemark", en: "Denmark" },
          lat: 55.68, lon: 12.57, juist: true,
          tekst: {
            nl: "Hier hielden we een korte stop in Kopenhagen tijdens onze trektocht van 2023.",
            fr: "Nous avons fait une courte halte à Copenhague pendant notre trek de 2023.",
            en: "We made a short stop in Copenhagen during our 2023 trek.",
          },
          fotos: ["fotos/kopenhagen-nyhavn.jpg", "fotos/schilderij-nyhavn.jpg"],
        },
        {
          naam: { nl: "België", fr: "Belgique", en: "Belgium" },
          lat: 50.75, lon: 4.5, juist: true,
          tekst: { nl: "Uiteraard, duh!", fr: "Évidemment, voyons !", en: "Obviously, duh!" },
          fotos: ["fotos/selfie-tong-uit.jpg", "fotos/selfie-gekke-bekken.jpg"],
        },
        {
          naam: { nl: "Oostenrijk", fr: "Autriche", en: "Austria" },
          lat: 47.6, lon: 14.2, juist: true,
          tekst: {
            nl: "Hier wonen we nu, in Wenen.",
            fr: "C'est ici que nous habitons maintenant, à Vienne.",
            en: "This is where we live now, in Vienna.",
          },
          fotos: [
            "fotos/fietsen-langs-rivier.jpg", "fotos/fietsen-kerncentrale.jpg", "fotos/fietshelm-achtung-kinder.jpg", "fotos/video-fietsen-oostenrijk.mp4",
            "fotos/skipiste-zonsondergang.jpg", "fotos/zelfgebakken-taart.jpg", "fotos/spiegelselfie-zuilen.jpg",
          ],
        },
        {
          naam: { nl: "Frankrijk", fr: "France", en: "France" },
          lat: 46.6, lon: 2.4, juist: true,
          tekst: {
            nl: "In Frankrijk komen we familie bezoeken en skiën.",
            fr: "En France, nous rendons visite à la famille et nous allons skier.",
            en: "In France we visit family and go skiing.",
          },
          fotos: ["fotos/sete-letters.jpg", "fotos/ontbijt-berghut.jpg", "fotos/strand-selfie-pet.jpg"],
        },
        {
          naam: { nl: "Slovenië", fr: "Slovénie", en: "Slovenia" },
          lat: 46.15, lon: 14.9, juist: true,
          tekst: {
            nl: "Hier gingen we in 2026 op trektocht, en hier werd het huwelijksaanzoek gedaan.",
            fr: "Nous y avons fait un trek en 2026, et c'est là qu'a eu lieu la demande en mariage.",
            en: "We went trekking here in 2026, and this is where the proposal happened.",
          },
          fotos: ["fotos/trektocht-bos.jpg", "fotos/trektocht-brug-rivier.jpg"],
        },
        {
          naam: { nl: "Slowakije", fr: "Slovaquie", en: "Slovakia" },
          lat: 48.7, lon: 19.4, juist: true,
          tekst: {
            nl: "In mei 2026 peddelden we hier in één dag naartoe met de kajak, vanuit Wenen.",
            fr: "En mai 2026, nous y sommes allés en kayak depuis Vienne, en une seule journée.",
            en: "In May 2026 we kayaked here from Vienna in a single day.",
          },
          fotos: ["fotos/video-kajak-donau.mp4"],
        },
        {
          naam: { nl: "Nederland", fr: "Pays-Bas", en: "Netherlands" },
          lat: 52.4, lon: 5.6, juist: true,
          tekst: {
            nl: "Hier komen we graag zeilen op het Veerse Meer.",
            fr: "Nous aimons venir faire de la voile sur le lac de Veere.",
            en: "We love coming here to sail on the Veerse Meer.",
          },
          fotos: ["fotos/zeilboot-mast-hond.jpg", "fotos/zeilen-op-het-meer.jpg", "fotos/video-zeilboot-meer.mp4"],
        },
        {
          naam: { nl: "Tsjechië", fr: "Tchéquie", en: "Czechia" },
          lat: 49.2, lon: 16.6, juist: true,
          tekst: {
            nl: "We bezochten samen Brno, waar Amélie op Erasmus zou gaan als corona er niet tussen was gekomen.",
            fr: "Nous avons visité ensemble Brno, où Amélie serait partie en Erasmus si le Covid ne s'en était pas mêlé.",
            en: "We visited Brno together, where Amélie would have gone on Erasmus if it hadn't been for Covid.",
          },
          fotos: [
            "fotos/mystery-travel-experience.jpg",
            "fotos/brno-selfie-station.jpg",
            "fotos/brno-vanoce-michiel.jpg",
            "fotos/brno-vanoce-amelie.jpg",
            "fotos/brno-kerstmarkt-langos.jpg",
          ],
        },
        {
          naam: { nl: "Zwitserland", fr: "Suisse", en: "Switzerland" },
          lat: 46.5, lon: 7.4, juist: true,
          tekst: {
            nl: "Hier begon alles, en in de zomer van 2026 gingen we er ook nog Simon bezoeken.",
            fr: "C'est ici que tout a commencé, et à l'été 2026 nous sommes aussi allés y rendre visite à Simon.",
            en: "This is where it all began, and in the summer of 2026 we also went to visit Simon here.",
          },
          fotos: [
            "fotos/geneve-kathedraal-regen-pruillip.jpg",
            "fotos/geneve-kathedraal-regen-close-up.jpg",
            "fotos/selfie-kamer-lachend.jpg",
            "fotos/selfie-kamer-mond-open.jpg",
          ],
        },
        {
          naam: { nl: "Zweden", fr: "Suède", en: "Sweden" },
          lat: 60.5, lon: 15.5, juist: true,
          tekst: {
            nl: "We bezochten Marine tijdens haar Erasmus.",
            fr: "Nous avons rendu visite à Marine pendant son Erasmus.",
            en: "We visited Marine during her Erasmus.",
          },
          fotos: [
            "fotos/zweden-stockholm-uitzicht.jpg",
            "fotos/zweden-stockholm-kade.jpg",
            "fotos/zweden-heuvel-zonsondergang.jpg",
            "fotos/zweden-stockholm-uitzicht-knuffel.jpg",
            "fotos/zweden-fiets-herstellen.jpg",
          ],
        },
        // landen waar we (nog) niet samen waren
        { naam: { nl: "Italië", fr: "Italie", en: "Italy" }, lat: 42.8, lon: 12.5 },
        { naam: { nl: "Spanje", fr: "Espagne", en: "Spain" }, lat: 40.2, lon: -3.7 },
        { naam: { nl: "Portugal", fr: "Portugal", en: "Portugal" }, lat: 39.6, lon: -8.0 },
        { naam: { nl: "Verenigd Koninkrijk", fr: "Royaume-Uni", en: "United Kingdom" }, lat: 52.6, lon: -1.6 },
        { naam: { nl: "Ierland", fr: "Irlande", en: "Ireland" }, lat: 53.2, lon: -8.0 },
        { naam: { nl: "Noorwegen", fr: "Norvège", en: "Norway" }, lat: 61.0, lon: 9.0 },
        { naam: { nl: "Polen", fr: "Pologne", en: "Poland" }, lat: 52.1, lon: 19.4 },
        { naam: { nl: "Hongarije", fr: "Hongrie", en: "Hungary" }, lat: 47.1, lon: 19.5 },
        { naam: { nl: "Griekenland", fr: "Grèce", en: "Greece" }, lat: 39.3, lon: 22.0 },
      ],
    },
    uitleg: {
      nl: "Groen: daar waren we samen. Rood: daar (nog) niet. Gestippeld: die heb je gemist.",
      fr: "Vert : nous y sommes allés ensemble. Rouge : pas (encore). En pointillés : celles que tu as manquées.",
      en: "Green: we've been there together. Red: not (yet). Dashed: the ones you missed.",
    },
    bravo: {
      nl: "Alle elf gevonden, en geen enkele te veel!",
      fr: "Tu les as trouvés tous les onze, et pas un de trop !",
      en: "All eleven found, and not one too many!",
    },
  },
  {
    vraag: {
      nl: "We hebben ons verloofd op de Juliana Trail in Slovenië. In welk dorpje gebeurde dat?",
      fr: "Nous nous sommes fiancés sur le Juliana Trail, en Slovénie. Dans quel village était-ce ?",
      en: "We got engaged on the Juliana Trail in Slovenia. In which village did it happen?",
    },
    kaart: {
      namenTonen: true,
      // begin- en eindpunten van de etappes; de lijn volgt de route ongeveer
      route: [[46.484, 13.785], [46.461, 13.937], [46.436, 14.053], [46.374, 14.205], [46.344, 14.174], [46.368, 14.114], [46.333, 13.965], [46.29, 13.89], [46.273, 13.955], [46.213, 13.96], [46.15, 13.875], [46.152, 13.744], [46.183, 13.733], [46.247, 13.579], [46.338, 13.552], [46.405, 13.597], [46.442, 13.567], [46.505, 13.585], [46.484, 13.785]],
      pinnen: [
        { naam: { nl: "Kranjska Gora" }, lat: 46.484, lon: 13.785, kant: "onder", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Mojstrana" }, lat: 46.461, lon: 13.937, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Jesenice" }, lat: 46.436, lon: 14.053, kant: "links", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Begunje" }, lat: 46.374, lon: 14.205, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        {
          naam: { nl: "Radovljica" }, lat: 46.344, lon: 14.174, kant: "onder", juist: true,
          tekst: {
            nl: "Hier, in Radovljica, werd het aanzoek gedaan.",
            fr: "C'est ici, à Radovljica, qu'a eu lieu la demande en mariage.",
            en: "This is where the proposal happened, in Radovljica.",
          },
          fotos: ["fotos/selfie-in-tent.jpg"],
        },
        { naam: { nl: "Bled" }, lat: 46.368, lon: 14.114, kant: "links", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Goreljek (Pokljuka)" }, lat: 46.333, lon: 13.965, kant: "onder", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Stara Fužina" }, lat: 46.29, lon: 13.89, kant: "links", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Bohinjska Bistrica" }, lat: 46.273, lon: 13.955, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Podbrdo" }, lat: 46.213, lon: 13.96, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Grahovo ob Bači" }, lat: 46.15, lon: 13.875, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Most na Soči" }, lat: 46.152, lon: 13.744, kant: "onder", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Tolmin" }, lat: 46.183, lon: 13.733, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Kobarid" }, lat: 46.247, lon: 13.579, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Bovec" }, lat: 46.338, lon: 13.552, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Log pod Mangartom" }, lat: 46.405, lon: 13.597, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Cave del Predil" }, lat: 46.442, lon: 13.567, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
        { naam: { nl: "Tarvisio" }, lat: 46.505, lon: 13.585, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail." } },
      ],
    },
    uitleg: {
      nl: "Het was in Radovljica.",
      fr: "C'était à Radovljica.",
      en: "It was in Radovljica.",
    },
    bravo: {
      nl: "In Radovljica!",
      fr: "À Radovljica !",
      en: "In Radovljica!",
    },
    fotoNa: {
      foto: "fotos/selfie-in-tent.jpg",
      alt: { nl: "Selfie in de tent", fr: "Selfie dans la tente", en: "Selfie in the tent" },
    },
  },
  {
    vraag: {
      nl: "En nu de hamvraag: wat doen wij op {datum}?",
      fr: "Et maintenant, la question à un million : que faisons-nous le {datum} ?",
      en: "And now the big question: what are we doing on {datum}?",
    },
    fotos: ["fotos/selfie-twijfelend.jpg"],
    antwoorden: [
      { nl: "Skiën in de Alpen", fr: "Skier dans les Alpes", en: "Skiing in the Alps" },
      { nl: "Met de tandem naar Sète", fr: "Aller à Sète en tandem", en: "Riding the tandem to Sète" },
      { nl: "Trouwen!", fr: "Nous marier !", en: "Getting married!" },
      { nl: "Galettes eten in Kopenhagen", fr: "Manger des galettes à Copenhague", en: "Eating galettes in Copenhagen" },
    ],
    juist: 2,
    uitleg: {
      nl: "Dat zouden we ook graag doen, maar die dag zeggen we 'ja' tegen elkaar.",
      fr: "Ce serait chouette aussi, mais ce jour-là, nous nous disons « oui ».",
      en: "We'd love that too, but on that day we're saying 'I do'.",
    },
    bravo: {
      nl: "Die dag zeggen we 'ja' tegen elkaar.",
      fr: "Ce jour-là, nous nous disons « oui ».",
      en: "That day, we're saying 'I do'.",
    },
  },
];
