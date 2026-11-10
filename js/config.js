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

  // Namen die het formulier voorstelt zodra een gast begint te typen (vrij typen blijft mogelijk).
  // Let op: deze lijst is voor iedereen zichtbaar in de broncode van de site.
  // Bijvoorbeeld: gasten: ["Jan & Marie Peeters", "Familie Janssens", "Sofie De Smet"],
  gasten: [],

  // URL van jullie Google Apps Script (zie LEESMIJ.md, stap 2).
  formulierUrl: "",

  talen: ["nl", "fr", "en", "de"],
  standaardTaal: "nl",

  // Stijl van de site: "hoeve", "veldbloemen" of "blauwe-inkt".
  stijl: "hoeve",
  // Achtergrond: "standaard" (de kleur van de stijl), "lichtblauw" of "donkerblauw".
  achtergrond: "donkerblauw",
  // Toont rechtsonder knopjes om stijl en achtergrond te wisselen. Zet op false voor de echte site.
  stijlKiezer: false,

  fotoIntro: "fotos/selfie-heuvels.jpg",
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
      nl: "Waar zijn Michiel en Amélie elkaar voor het eerst tegengekomen?",
      fr: "Où Michiel et Amélie se sont-ils rencontrés pour la première fois ?",
      en: "Where did Michiel and Amélie first meet?",
      de: "Wo sind sich Michiel und Amélie zum ersten Mal begegnet?",
    },
    fotos: ["fotos/groepsselfie-rivier.jpg", "fotos/houten-troon-kamp.jpg"],
    antwoorden: [
      { nl: "Bosuil 2021" },
      { nl: "Wigwam 2020" },
      { nl: "KHL-weekend 2022", fr: "Week-end KHL 2022", en: "KHL weekend 2022", de: "KHL-Wochenende 2022" },
      { nl: "Roads to Narnia 2022" },
    ],
    juist: 0,
    uitleg: {
      nl: "Op Bosuil in 2021: Amélie kwam op de eind-SBT helpen om het kamp af te breken.",
      fr: "À Bosuil en 2021 : Amélie est venue aider à démonter le camp.",
      en: "At Bosuil in 2021: Amélie came to help take down the camp at the end.",
      de: "Bei Bosuil 2021: Amélie kam am Ende, um beim Abbau des Lagers zu helfen.",
    },
    bravo: {
      nl: "Amélie kwam op de eind-SBT helpen om het Bosuil-kamp af te breken.",
      fr: "Amélie est venue aider à démonter le camp Bosuil.",
      en: "Amélie came to help take down the Bosuil camp.",
      de: "Amélie kam, um beim Abbau des Bosuil-Lagers zu helfen.",
    },
  },
  {
    vraag: {
      nl: "En waar hebben Michiel en Amélie elkaar echt leren kennen?",
      fr: "Et où Michiel et Amélie ont-ils vraiment appris à se connaître ?",
      en: "And where did Michiel and Amélie really get to know each other?",
      de: "Und wo haben sich Michiel und Amélie wirklich kennengelernt?",
    },
    fotos: ["fotos/kamp-bijl-en-moker.jpg", "fotos/groepsfoto-park-zonsondergang.jpg"],
    antwoorden: [
      { nl: "Troubles at the North Pole 2022" },
      { nl: "Wigwam 2020" },
      { nl: "KHL-weekend 2022", fr: "Week-end KHL 2022", en: "KHL weekend 2022", de: "KHL-Wochenende 2022" },
      { nl: "Roads to Narnia 2022" },
    ],
    juist: 3,
    uitleg: {
      nl: "Op Roads to Narnia in 2022, waar we samen kampleiding waren. Op het KHL-weekend hebben we niet echt met elkaar gepraat, en Troubles at the North Pole ging pas in 2023 door: het tweede kamp waarvan we samen kampleiding waren.",
      fr: "À Roads to Narnia en 2022, où nous étions ensemble responsables du camp. Au week-end KHL, nous ne nous sommes pas vraiment parlé, et Troubles at the North Pole n'a eu lieu qu'en 2023 : le deuxième camp dont nous étions ensemble responsables.",
      en: "At Roads to Narnia in 2022, where we were camp leaders together. At the KHL weekend we didn't really talk to each other, and Troubles at the North Pole only took place in 2023: the second camp we led together.",
      de: "Bei Roads to Narnia 2022, wo wir gemeinsam die Lagerleitung hatten. Beim KHL-Wochenende haben wir nicht wirklich miteinander gesprochen, und Troubles at the North Pole fand erst 2023 statt: das zweite Lager, das wir zusammen geleitet haben.",
    },
    bravo: {
      nl: "Op Roads to Narnia, waar we samen kampleiding waren. Op het KHL-weekend hebben we niet echt met elkaar gepraat, en Troubles at the North Pole ging pas in 2023 door: het tweede kamp waarvan we samen kampleiding waren.",
      fr: "À Roads to Narnia, où nous étions ensemble responsables du camp. Au week-end KHL, nous ne nous sommes pas vraiment parlé, et Troubles at the North Pole n'a eu lieu qu'en 2023 : le deuxième camp dont nous étions ensemble responsables.",
      en: "At Roads to Narnia, where we were camp leaders together. At the KHL weekend we didn't really talk to each other, and Troubles at the North Pole only took place in 2023: the second camp we led together.",
      de: "Bei Roads to Narnia, wo wir gemeinsam die Lagerleitung hatten. Beim KHL-Wochenende haben wir nicht wirklich miteinander gesprochen, und Troubles at the North Pole fand erst 2023 statt: das zweite Lager, das wir zusammen geleitet haben.",
    },
  },
  {
    vraag: {
      nl: "Waar heeft Amélie Michiel aan de haak geslagen?",
      fr: "Où Michiel a-t-il mordu à l'hameçon d'Amélie ?",
      en: "Where did Amélie get Michiel hooked?",
      de: "Wo ist Michiel Amélie an den Haken gegangen?",
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
      nl: "Figuurlijk in Genève, en letterlijk aan het Lac du Salagou: in het meer lag een oude vishaak die zich vastzette in Amélies waterschoen, waarmee ze tijdens een watergevecht per ongeluk tegen Michiel trapte.",
      fr: "Au sens figuré à Genève, et au sens propre au lac du Salagou : un vieil hameçon traînait dans le lac et s'est accroché à la chaussure aquatique d'Amélie, avec laquelle elle a donné par accident un coup de pied à Michiel pendant une bataille d'eau.",
      en: "Figuratively in Geneva, and literally at the Lac du Salagou: an old fishing hook in the lake got stuck in Amélie's water shoe, which she then accidentally kicked Michiel with during a water fight.",
      de: "Im übertragenen Sinn in Genf, und ganz wörtlich am Lac du Salagou: Im See lag ein alter Angelhaken, der sich in Amélies Wasserschuh verfing, mit dem sie Michiel bei einer Wasserschlacht versehentlich trat.",
    },
    bravo: {
      nl: "Figuurlijk in Genève, en letterlijk aan het Lac du Salagou: in het meer lag een oude vishaak die zich vastzette in Amélies waterschoen, waarmee ze tijdens een watergevecht per ongeluk tegen Michiel trapte.",
      fr: "Au sens figuré à Genève, et au sens propre au lac du Salagou : un vieil hameçon traînait dans le lac et s'est accroché à la chaussure aquatique d'Amélie, avec laquelle elle a donné par accident un coup de pied à Michiel pendant une bataille d'eau.",
      en: "Figuratively in Geneva, and literally at the Lac du Salagou: an old fishing hook in the lake got stuck in Amélie's water shoe, which she then accidentally kicked Michiel with during a water fight.",
      de: "Im übertragenen Sinn in Genf, und ganz wörtlich am Lac du Salagou: Im See lag ein alter Angelhaken, der sich in Amélies Wasserschuh verfing, mit dem sie Michiel bei einer Wasserschlacht versehentlich trat.",
    },
  },
  {
    vraag: {
      nl: "Wat was er te doen in Genève?",
      fr: "Qu'y avait-il à faire à Genève ?",
      en: "What was there to do in Geneva?",
      de: "Was gab es in Genf zu tun?",
    },
    fotos: ["fotos/geneve-kathedraal-regen-wijzen.jpg", "fotos/geneve-haven-gele-jas.jpg", "fotos/selfie-kamer-serieus.jpg"],
    antwoorden: [
      { nl: "Michiel wou de LHC bezoeken", fr: "Michiel voulait visiter le LHC", en: "Michiel wanted to visit the LHC", de: "Michiel wollte den LHC besuchen" },
      { nl: "Amélie was er op Erasmus", fr: "Amélie y était en Erasmus", en: "Amélie was there on Erasmus", de: "Amélie machte dort ihr Erasmus" },
      { nl: "Zwitserland is een leuke eerste date", fr: "La Suisse, c'est un chouette premier rendez-vous", en: "Switzerland makes a nice first date", de: "Die Schweiz ist ein schönes erstes Date" },
      { nl: "Amélie wou de kerstmarkt daar bezoeken", fr: "Amélie voulait visiter le marché de Noël là-bas", en: "Amélie wanted to visit the Christmas market there", de: "Amélie wollte den Weihnachtsmarkt dort besuchen" },
    ],
    juist: [1, 2],
    uitleg: {
      nl: "Amélie zat in Genève op Erasmus, en Zwitserland is nu eenmaal een leuke eerste date.",
      fr: "Amélie était en Erasmus à Genève, et la Suisse, c'est tout simplement un chouette premier rendez-vous.",
      en: "Amélie was on Erasmus in Geneva, and Switzerland simply makes a nice first date.",
      de: "Amélie machte ihr Erasmus in Genf, und die Schweiz ist nun mal ein schönes erstes Date.",
    },
    bravo: {
      nl: "Amélie zat in Genève op Erasmus, en Zwitserland is nu eenmaal een leuke eerste date.",
      fr: "Amélie était en Erasmus à Genève, et la Suisse, c'est tout simplement un chouette premier rendez-vous.",
      en: "Amélie was on Erasmus in Geneva, and Switzerland simply makes a nice first date.",
      de: "Amélie machte ihr Erasmus in Genf, und die Schweiz ist nun mal ein schönes erstes Date.",
    },
  },
  {
    vraag: {
      nl: "Amélies familie komt gedeeltelijk uit Bretagne, waar het traditie is om Bretoense galettes te eten. Waar at Michiel zijn allereerste Bretoense galette, in een Asterix-restaurant?",
      fr: "La famille d'Amélie vient en partie de Bretagne, où la tradition est de manger des galettes bretonnes. Où Michiel a-t-il mangé sa toute première galette bretonne, dans un restaurant Astérix ?",
      en: "Part of Amélie's family comes from Brittany, where eating Breton galettes is a tradition. Where did Michiel eat his very first Breton galette, in an Asterix restaurant?",
      de: "Amélies Familie stammt zum Teil aus der Bretagne, wo es Tradition ist, bretonische Galettes zu essen. Wo hat Michiel seine allererste bretonische Galette gegessen, in einem Asterix-Restaurant?",
    },
    fotos: ["fotos/galettes-eten.jpg", "fotos/bord-la-galette.jpg"],
    antwoorden: [
      { nl: "Vannes" },
      { nl: "Saint-Malo" },
      { nl: "Parijs", fr: "Paris", en: "Paris", de: "Paris" },
      { nl: "Brussel", fr: "Bruxelles", en: "Brussels", de: "Brüssel" },
      { nl: "Kopenhagen", fr: "Copenhague", en: "Copenhagen", de: "Kopenhagen" },
      { nl: "Amsterdam" },
    ],
    juist: 4,
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
      nl: "In welk district van Wenen wonen Amélie en Michiel?",
      fr: "Dans quel arrondissement de Vienne habitent Amélie et Michiel ?",
      en: "In which district of Vienna do Amélie and Michiel live?",
      de: "In welchem Wiener Bezirk wohnen Amélie und Michiel?",
    },
    fotos: ["fotos/verhuisdozen.jpg"],
    antwoorden: [
      { nl: "1e: Innere Stadt", fr: "1er : Innere Stadt", en: "1st: Innere Stadt", de: "1.: Innere Stadt" },
      { nl: "2e: Leopoldstadt", fr: "2e : Leopoldstadt", en: "2nd: Leopoldstadt", de: "2.: Leopoldstadt" },
      { nl: "7e: Neubau", fr: "7e : Neubau", en: "7th: Neubau", de: "7.: Neubau" },
      { nl: "9e: Alsergrund", fr: "9e : Alsergrund", en: "9th: Alsergrund", de: "9.: Alsergrund" },
      { nl: "20e: Brigittenau", fr: "20e : Brigittenau", en: "20th: Brigittenau", de: "20.: Brigittenau" },
    ],
    juist: 4,
    uitleg: {
      nl: "We wonen in het 20e district: Brigittenau, tussen de Donau en het Donaukanal.",
      fr: "Nous habitons dans le 20e arrondissement : Brigittenau, entre le Danube et le canal du Danube.",
      en: "We live in the 20th district: Brigittenau, between the Danube and the Danube Canal.",
      de: "Wir wohnen im 20. Bezirk: Brigittenau, zwischen der Donau und dem Donaukanal.",
    },
    bravo: {
      nl: "Het 20e district: Brigittenau, tussen de Donau en het Donaukanal.",
      fr: "Le 20e arrondissement : Brigittenau, entre le Danube et le canal du Danube.",
      en: "The 20th district: Brigittenau, between the Danube and the Danube Canal.",
      de: "Der 20. Bezirk: Brigittenau, zwischen der Donau und dem Donaukanal.",
    },
    fotoNa: {
      foto: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Vienna%2C_administrative_divisions_-_Nmbrs.svg",
      alt: { nl: "Kaart van de 23 districten van Wenen", fr: "Carte des 23 arrondissements de Vienne", en: "Map of the 23 districts of Vienna", de: "Karte der 23 Wiener Bezirke" },
      bijschrift: {
        nl: "De 23 districten van Wenen. Kaart: TUBS, CC BY-SA 3.0, via Wikimedia Commons",
        fr: "Les 23 arrondissements de Vienne. Carte : TUBS, CC BY-SA 3.0, via Wikimedia Commons",
        en: "The 23 districts of Vienna. Map: TUBS, CC BY-SA 3.0, via Wikimedia Commons",
        de: "Die 23 Wiener Bezirke. Karte: TUBS, CC BY-SA 3.0, via Wikimedia Commons",
      },
    },
  },
  {
    vraag: {
      nl: "Wie won het pingpongkampioenschap tijdens de januari-examens van 2024?",
      fr: "Qui a remporté le championnat de ping-pong pendant les examens de janvier 2024 ?",
      en: "Who won the ping-pong championship during the January 2024 exams?",
      de: "Wer hat die Tischtennismeisterschaft während der Januar-Prüfungen 2024 gewonnen?",
    },
    fotos: [],
    antwoorden: [{ nl: "Amélie" }, { nl: "Michiel" }],
    juist: 0,
    uitleg: {
      nl: "Amélie, en ze kreeg toen de kroon van winnaar van dat jaar. (Vraag maar niet van wie.)",
      fr: "Amélie, et elle a reçu la couronne de la gagnante de l'année. (Mieux vaut ne pas demander de qui elle la tient.)",
      en: "Amélie, and she got that year's winner's crown. (Don't ask who she got it from.)",
      de: "Amélie, und sie bekam die Siegerkrone des Jahres. (Frag lieber nicht, von wem.)",
    },
    bravo: {
      nl: "Amélie, en ze kreeg toen de kroon van winnaar van dat jaar. (Vraag maar niet van wie.)",
      fr: "Amélie, et elle a reçu la couronne de la gagnante de l'année. (Mieux vaut ne pas demander de qui elle la tient.)",
      en: "Amélie, and she got that year's winner's crown. (Don't ask who she got it from.)",
      de: "Amélie, und sie bekam die Siegerkrone des Jahres. (Frag lieber nicht, von wem.)",
    },
    fotoNa: {
      foto: "fotos/pingpong-koksmuts.jpg",
      alt: { nl: "Amélie met pingpongbatje en koksmuts", fr: "Amélie avec une raquette de ping-pong et une toque", en: "Amélie with a ping-pong bat and a chef's hat", de: "Amélie mit Tischtennisschläger und Kochmütze" },
    },
  },
  {
    vraag: {
      nl: "In welke winkel, waar Amélie altijd haar beste snufjes vond, werkt ze nu?",
      fr: "Dans quel magasin, où Amélie dénichait toujours ses meilleures trouvailles, travaille-t-elle maintenant ?",
      en: "Which shop, where Amélie always found her best gadgets, does she work at now?",
      de: "In welchem Geschäft, in dem Amélie immer ihre besten Fundstücke gefunden hat, arbeitet sie jetzt?",
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
      nl: "Amélie werkt nu bij Decathlon, de winkel waar ze altijd haar beste snufjes vond.",
      fr: "Amélie travaille maintenant chez Decathlon, le magasin où elle dénichait toujours ses meilleures trouvailles.",
      en: "Amélie now works at Decathlon, the shop where she always found her best gadgets.",
      de: "Amélie arbeitet jetzt bei Decathlon, dem Geschäft, in dem sie immer ihre besten Fundstücke gefunden hat.",
    },
    bravo: {
      nl: "Bij Decathlon, waar ze altijd haar beste snufjes vond.",
      fr: "Chez Decathlon, où elle dénichait toujours ses meilleures trouvailles.",
      en: "At Decathlon, where she always found her best gadgets.",
      de: "Bei Decathlon, wo sie immer ihre besten Fundstücke gefunden hat.",
    },
  },
  {
    vraag: {
      nl: "Hoe heten de broers en zussen van Amélie en Michiel?",
      fr: "Comment s'appellent les frères et sœurs d'Amélie et Michiel ?",
      en: "What are the names of Amélie and Michiel's brothers and sisters?",
      de: "Wie heißen die Geschwister von Amélie und Michiel?",
    },
    fotos: [],
    antwoorden: [
      { nl: "Julie, Simon, Quentin en Marie", fr: "Julie, Simon, Quentin et Marie", en: "Julie, Simon, Quentin and Marie", de: "Julie, Simon, Quentin und Marie" },
      { nl: "Jolien, Simon, Corentin en Marine", fr: "Jolien, Simon, Corentin et Marine", en: "Jolien, Simon, Corentin and Marine", de: "Jolien, Simon, Corentin und Marine" },
      { nl: "Joke, Sam, Corentin en Martine", fr: "Joke, Sam, Corentin et Martine", en: "Joke, Sam, Corentin and Martine", de: "Joke, Sam, Corentin und Martine" },
      { nl: "Jolien, Stijn, Coralie en Marine", fr: "Jolien, Stijn, Coralie et Marine", en: "Jolien, Stijn, Coralie and Marine", de: "Jolien, Stijn, Coralie und Marine" },
    ],
    juist: 1,
    uitleg: {
      nl: "Jolien, Simon, Corentin en Marine.",
      fr: "Jolien, Simon, Corentin et Marine.",
      en: "Jolien, Simon, Corentin and Marine.",
      de: "Jolien, Simon, Corentin und Marine.",
    },
  },
  {
    vraag: {
      nl: "Hoeveel neven en nichten heeft Michiel?",
      fr: "Combien de cousins et cousines Michiel a-t-il ?",
      en: "How many cousins does Michiel have?",
      de: "Wie viele Cousins und Cousinen hat Michiel?",
    },
    fotos: ["fotos/koken-houten-keuken.jpg", "fotos/skien-groepsfoto.jpg"],
    antwoorden: [{ nl: "4" }, { nl: "8" }, { nl: "12" }, { nl: "16" }, { nl: "20" }],
    juist: 2,
    uitleg: {
      nl: "Michiel heeft 12 neven en nichten.",
      fr: "Michiel a 12 cousins et cousines.",
      en: "Michiel has 12 cousins.",
      de: "Michiel hat 12 Cousins und Cousinen.",
    },
  },
  {
    vraag: {
      nl: "En hoeveel neven en nichten heeft Amélie?",
      fr: "Et combien de cousins et cousines Amélie a-t-elle ?",
      en: "And how many cousins does Amélie have?",
      de: "Und wie viele Cousins und Cousinen hat Amélie?",
    },
    fotos: [],
    antwoorden: [{ nl: "4" }, { nl: "8" }, { nl: "12" }, { nl: "16" }, { nl: "20" }],
    juist: 0,
    uitleg: {
      nl: "Amélie heeft 4 neven en nichten.",
      fr: "Amélie a 4 cousins et cousines.",
      en: "Amélie has 4 cousins.",
      de: "Amélie hat 4 Cousins und Cousinen.",
    },
  },
  {
    vraag: {
      nl: "Wie draagt de broek in de relatie?",
      fr: "Qui porte la culotte dans le couple ?",
      en: "Who wears the trousers in the relationship?",
      de: "Wer hat in der Beziehung die Hosen an?",
    },
    fotos: ["fotos/tafel-rode-muur.jpg"],
    antwoorden: [{ nl: "Michiel" }, { nl: "Amélie" }],
    juist: 1,
    uitleg: {
      nl: "We komen er samen vaak uit, maar als het moet, dan Amélie ;)",
      fr: "Nous trouvons souvent une solution ensemble, mais s'il le faut, c'est Amélie ;)",
      en: "We usually work it out together, but if push comes to shove, it's Amélie ;)",
      de: "Meistens finden wir zusammen eine Lösung, aber wenn es sein muss, dann Amélie ;)",
    },
    bravo: {
      nl: "We komen er samen vaak uit, maar als het moet, dan Amélie ;)",
      fr: "Nous trouvons souvent une solution ensemble, mais s'il le faut, c'est Amélie ;)",
      en: "We usually work it out together, but if push comes to shove, it's Amélie ;)",
      de: "Meistens finden wir zusammen eine Lösung, aber wenn es sein muss, dann Amélie ;)",
    },
  },
  {
    vraag: {
      nl: "We zijn allebei veel sociale engagementen aangegaan. Wat waren die van Amélie door de jaren heen?",
      fr: "Nous nous sommes tous les deux beaucoup engagés socialement. Quels ont été les engagements d'Amélie au fil des ans ?",
      en: "We've both taken on lots of social commitments. What were Amélie's over the years?",
      de: "Wir haben uns beide viel sozial engagiert. Was waren Amélies Engagements im Lauf der Jahre?",
    },
    fotos: ["fotos/sporthal-medaille.jpg", "fotos/klimgordels.jpg"],
    antwoorden: [
      { nl: "Kring, OD en Pagadderke", fr: "Kring, OD et Pagadderke", en: "Kring, OD and Pagadderke", de: "Kring, OD und Pagadderke" },
      { nl: "Bizon, Théâtre Universitaire de Louvain en IncluKap", fr: "Bizon, Théâtre Universitaire de Louvain et IncluKap", en: "Bizon, Théâtre Universitaire de Louvain and IncluKap", de: "Bizon, Théâtre Universitaire de Louvain und IncluKap" },
      { nl: "Chiro, Rode Kruis en IncluKap", fr: "Chiro, Croix-Rouge et IncluKap", en: "Chiro, Red Cross and IncluKap", de: "Chiro, Rotes Kreuz und IncluKap" },
      { nl: "Scouts, Théâtre Universitaire de Louvain en Oxfam", fr: "Scouts, Théâtre Universitaire de Louvain et Oxfam", en: "Scouts, Théâtre Universitaire de Louvain and Oxfam", de: "Pfadfinder, Théâtre Universitaire de Louvain und Oxfam" },
    ],
    juist: 1,
    uitleg: {
      nl: "Bizon, Théâtre Universitaire de Louvain en IncluKap.",
      fr: "Bizon, le Théâtre Universitaire de Louvain et IncluKap.",
      en: "Bizon, Théâtre Universitaire de Louvain and IncluKap.",
      de: "Bizon, Théâtre Universitaire de Louvain und IncluKap.",
    },
  },
  {
    vraag: {
      nl: "En wat zijn de sociale engagementen van Michiel?",
      fr: "Et quels sont les engagements sociaux de Michiel ?",
      en: "And what are Michiel's social commitments?",
      de: "Und was sind Michiels soziale Engagements?",
    },
    video: "fotos/video-verkleed-dansje-kamp.mp4",
    antwoorden: [
      { nl: "Kring, Chiro, Bizon en Scouts", fr: "Kring, Chiro, Bizon et Scouts", en: "Kring, Chiro, Bizon and Scouts", de: "Kring, Chiro, Bizon und Pfadfinder" },
      { nl: "Théâtre Universitaire, OD en IncluKap", fr: "Théâtre Universitaire, OD et IncluKap", en: "Théâtre Universitaire, OD and IncluKap", de: "Théâtre Universitaire, OD und IncluKap" },
      { nl: "Kring, OD, Bizon en Pagadderke", fr: "Kring, OD, Bizon et Pagadderke", en: "Kring, OD, Bizon and Pagadderke", de: "Kring, OD, Bizon und Pagadderke" },
      { nl: "Studentenraad, OD, KSA en Pagadderke", fr: "Conseil étudiant, OD, KSA et Pagadderke", en: "Student council, OD, KSA and Pagadderke", de: "Studierendenrat, OD, KSA und Pagadderke" },
    ],
    juist: 2,
    uitleg: {
      nl: "Kring, OD, Bizon en Pagadderke.",
      fr: "Kring, OD, Bizon et Pagadderke.",
      en: "Kring, OD, Bizon and Pagadderke.",
      de: "Kring, OD, Bizon und Pagadderke.",
    },
  },
  {
    vraag: {
      nl: "Wat is onze gemeenschappelijke hobby?",
      fr: "Quel est notre hobby commun ?",
      en: "What hobby do we share?",
      de: "Was ist unser gemeinsames Hobby?",
    },
    fotos: ["fotos/romeinen-lauwerkrans.jpg"],
    antwoorden: [
      { nl: "Improvisatietheater", fr: "Le théâtre d'improvisation", en: "Improv theatre", de: "Improvisationstheater" },
      { nl: "Romeinse re-enactment", fr: "La reconstitution romaine", en: "Roman re-enactment", de: "Römisches Reenactment" },
      { nl: "Koken", fr: "La cuisine", en: "Cooking", de: "Kochen" },
      { nl: "Onnozel doen om de wereld te verbeteren", fr: "Faire les fous pour rendre le monde meilleur", en: "Being silly to make the world a better place", de: "Herumalbern, um die Welt zu verbessern" },
    ],
    // drie juiste antwoorden: alles behalve de Romeinen
    juist: [0, 2, 3],
    uitleg: {
      nl: "Improvisatietheater, koken en onnozel doen op kamp om de wereld te verbeteren voor kinderen in maatschappelijk kwetsbare situaties.",
      fr: "Le théâtre d'improvisation, la cuisine et faire les fous en camp pour rendre le monde meilleur pour des enfants en situation de vulnérabilité sociale.",
      en: "Improv theatre, cooking, and being silly at camp to make the world better for children in socially vulnerable situations.",
      de: "Improvisationstheater, Kochen und im Lager herumalbern, um die Welt für Kinder in sozial schwierigen Situationen besser zu machen.",
    },
    bravo: {
      nl: "Improvisatietheater, koken én onnozel doen op kamp om de wereld te verbeteren voor kinderen in maatschappelijk kwetsbare situaties.",
      fr: "Le théâtre d'improvisation, la cuisine et faire les fous en camp pour rendre le monde meilleur pour des enfants en situation de vulnérabilité sociale.",
      en: "Improv theatre, cooking, and being silly at camp to make the world better for children in socially vulnerable situations.",
      de: "Improvisationstheater, Kochen und im Lager herumalbern, um die Welt für Kinder in sozial schwierigen Situationen besser zu machen.",
    },
  },
  {
    vraag: {
      nl: "Waar zijn we samen al geweest? Duid alle landen aan, maar pas op voor de pinnen waar we nog niet waren!",
      fr: "Où sommes-nous déjà allés ensemble ? Sélectionne tous les pays, mais attention aux épingles où nous ne sommes pas encore allés !",
      en: "Where have we been together? Select all the countries, but watch out for the pins where we haven't been yet!",
      de: "Wo waren wir schon zusammen? Wähle alle Länder aus, aber Vorsicht bei den Pins, wo wir noch nicht waren!",
    },
    kaart: {
      direct: true,
      pinnen: [
        {
          naam: { nl: "Duitsland", fr: "Allemagne", en: "Germany", de: "Deutschland" },
          lat: 51.1, lon: 10.4, juist: true,
          tekst: {
            nl: "Hier begon onze trektocht, in september 2023.",
            fr: "C'est ici qu'a commencé notre trek, en septembre 2023.",
            en: "This is where our trek began, in September 2023.",
            de: "Hier begann unsere Trekkingtour, im September 2023.",
          },
          fotos: ["fotos/tandem-fiets.jpg", "fotos/pasta-eten.jpg", "fotos/wandelen-dijk-silo.jpg"],
        },
        {
          naam: { nl: "Denemarken", fr: "Danemark", en: "Denmark", de: "Dänemark" },
          lat: 55.68, lon: 12.57, juist: true,
          tekst: {
            nl: "Hier waren we samen in 2023, op het einde van onze trektocht.",
            fr: "Nous étions ici ensemble en 2023, à la fin de notre trek.",
            en: "We were here together in 2023, at the end of our trek.",
            de: "Hier waren wir 2023 zusammen, am Ende unserer Trekkingtour.",
          },
          fotos: ["fotos/kopenhagen-nyhavn.jpg", "fotos/schilderij-nyhavn.jpg"],
        },
        {
          naam: { nl: "België", fr: "Belgique", en: "Belgium", de: "Belgien" },
          lat: 50.75, lon: 4.5, juist: true,
          tekst: { nl: "Uiteraard, duh!", fr: "Évidemment, voyons !", en: "Obviously, duh!", de: "Na klar, logisch!" },
          fotos: ["fotos/selfie-tong-uit.jpg", "fotos/selfie-gekke-bekken.jpg"],
        },
        {
          naam: { nl: "Oostenrijk", fr: "Autriche", en: "Austria", de: "Österreich" },
          lat: 47.6, lon: 14.2, juist: true,
          tekst: {
            nl: "Hier wonen we nu, in Wenen.",
            fr: "C'est ici que nous habitons maintenant, à Vienne.",
            en: "This is where we live now, in Vienna.",
            de: "Hier wohnen wir jetzt, in Wien.",
          },
          fotos: [
            "fotos/fietsen-langs-rivier.jpg", "fotos/fietsen-kerncentrale.jpg", "fotos/fietshelm-achtung-kinder.jpg",
            "fotos/skipiste-zonsondergang.jpg", "fotos/zelfgebakken-taart.jpg", "fotos/spiegelselfie-zuilen.jpg",
          ],
        },
        {
          naam: { nl: "Frankrijk", fr: "France", en: "France", de: "Frankreich" },
          lat: 46.6, lon: 2.4, juist: true,
          tekst: {
            nl: "Hier komen we om familie te bezoeken en te genieten van het leven.",
            fr: "Nous y venons pour rendre visite à la famille et profiter de la vie.",
            en: "We come here to visit family and enjoy life.",
            de: "Hierher kommen wir, um die Familie zu besuchen und das Leben zu genießen.",
          },
          fotos: ["fotos/sete-letters.jpg", "fotos/ontbijt-berghut.jpg", "fotos/strand-selfie-pet.jpg"],
        },
        {
          naam: { nl: "Slovenië", fr: "Slovénie", en: "Slovenia", de: "Slowenien" },
          lat: 46.15, lon: 14.9, juist: true,
          tekst: {
            nl: "Hier gingen we in 2026 op trektocht, en hier werd het huwelijksaanzoek gedaan.",
            fr: "Nous y avons fait un trek en 2026, et c'est là qu'a eu lieu la demande en mariage.",
            en: "We went trekking here in 2026, and this is where the proposal happened.",
            de: "Hier waren wir 2026 wandern, und hier fand der Heiratsantrag statt.",
          },
          fotos: ["fotos/trektocht-bos.jpg", "fotos/trektocht-brug-rivier.jpg"],
        },
        {
          naam: { nl: "Slowakije", fr: "Slovaquie", en: "Slovakia", de: "Slowakei" },
          lat: 48.7, lon: 19.4, juist: true,
          tekst: {
            nl: "In mei 2026 peddelden we hier in één dag naartoe met de kajak, vanuit Wenen.",
            fr: "En mai 2026, nous y sommes allés en kayak depuis Vienne, en une seule journée.",
            en: "In May 2026 we kayaked here from Vienna in a single day.",
            de: "Im Mai 2026 sind wir von Wien aus an einem Tag mit dem Kajak hierher gepaddelt.",
          },
          fotos: ["fotos/grindbank-zwemvest.jpg"],
        },
        {
          naam: { nl: "Nederland", fr: "Pays-Bas", en: "Netherlands", de: "Niederlande" },
          lat: 52.4, lon: 5.6, juist: true,
          tekst: {
            nl: "Hier komen we graag zeilen.",
            fr: "Nous aimons y venir faire de la voile.",
            en: "We love coming here to sail.",
            de: "Hier segeln wir gern.",
          },
          fotos: ["fotos/zeilboot-mast-hond.jpg", "fotos/zeilen-op-het-meer.jpg"],
        },
        {
          naam: { nl: "Tsjechië", fr: "Tchéquie", en: "Czechia", de: "Tschechien" },
          lat: 49.2, lon: 16.6, juist: true,
          tekst: {
            nl: "We bezochten samen Brno, waar Amélie op Erasmus zou gaan als corona er niet tussen was gekomen.",
            fr: "Nous avons visité ensemble Brno, où Amélie serait partie en Erasmus si le Covid ne s'en était pas mêlé.",
            en: "We visited Brno together, where Amélie would have gone on Erasmus if it hadn't been for Covid.",
            de: "Wir haben zusammen Brno besucht, wo Amélie ohne Corona ihr Erasmus gemacht hätte.",
          },
        },
        {
          naam: { nl: "Zwitserland", fr: "Suisse", en: "Switzerland", de: "Schweiz" },
          lat: 46.5, lon: 7.4, juist: true,
          tekst: { nl: "Hier begon alles.", fr: "C'est ici que tout a commencé.", en: "This is where it all began.", de: "Hier hat alles angefangen." },
          fotos: [
            "fotos/geneve-kathedraal-regen-pruillip.jpg",
            "fotos/geneve-kathedraal-regen-close-up.jpg",
            "fotos/selfie-kamer-lachend.jpg",
            "fotos/selfie-kamer-mond-open.jpg",
          ],
        },
        {
          naam: { nl: "Zweden", fr: "Suède", en: "Sweden", de: "Schweden" },
          lat: 60.5, lon: 15.5, juist: true,
          tekst: {
            nl: "We bezochten Marine tijdens haar Erasmus.",
            fr: "Nous avons rendu visite à Marine pendant son Erasmus.",
            en: "We visited Marine during her Erasmus.",
            de: "Wir haben Marine während ihres Erasmus besucht.",
          },
        },
        // landen waar we (nog) niet samen waren
        { naam: { nl: "Italië", fr: "Italie", en: "Italy", de: "Italien" }, lat: 42.8, lon: 12.5 },
        { naam: { nl: "Spanje", fr: "Espagne", en: "Spain", de: "Spanien" }, lat: 40.2, lon: -3.7 },
        { naam: { nl: "Portugal", fr: "Portugal", en: "Portugal", de: "Portugal" }, lat: 39.6, lon: -8.0 },
        { naam: { nl: "Verenigd Koninkrijk", fr: "Royaume-Uni", en: "United Kingdom", de: "Vereinigtes Königreich" }, lat: 52.6, lon: -1.6 },
        { naam: { nl: "Ierland", fr: "Irlande", en: "Ireland", de: "Irland" }, lat: 53.2, lon: -8.0 },
        { naam: { nl: "Noorwegen", fr: "Norvège", en: "Norway", de: "Norwegen" }, lat: 61.0, lon: 9.0 },
        { naam: { nl: "Polen", fr: "Pologne", en: "Poland", de: "Polen" }, lat: 52.1, lon: 19.4 },
        { naam: { nl: "Hongarije", fr: "Hongrie", en: "Hungary", de: "Ungarn" }, lat: 47.1, lon: 19.5 },
        { naam: { nl: "Griekenland", fr: "Grèce", en: "Greece", de: "Griechenland" }, lat: 39.3, lon: 22.0 },
      ],
    },
    uitleg: {
      nl: "Groen: daar waren we samen. Rood: daar (nog) niet. Gestippeld: die heb je gemist.",
      fr: "Vert : nous y sommes allés ensemble. Rouge : pas (encore). En pointillés : celles que tu as manquées.",
      en: "Green: we've been there together. Red: not (yet). Dashed: the ones you missed.",
      de: "Grün: Da waren wir zusammen. Rot: (noch) nicht. Gestrichelt: die hast du verpasst.",
    },
    bravo: {
      nl: "Alle elf gevonden, en geen enkele te veel!",
      fr: "Tu les as trouvés tous les onze, et pas un de trop !",
      en: "All eleven found, and not one too many!",
      de: "Alle elf gefunden, und keiner zu viel!",
    },
  },
  {
    vraag: {
      nl: "Michiel heeft Amélie ten huwelijk gevraagd op de Juliana Trail in Slovenië. In welk dorpje gebeurde dat?",
      fr: "Michiel a demandé Amélie en mariage sur le Juliana Trail, en Slovénie. Dans quel village était-ce ?",
      en: "Michiel proposed to Amélie on the Juliana Trail in Slovenia. In which village did it happen?",
      de: "Michiel hat Amélie auf dem Juliana Trail in Slowenien einen Heiratsantrag gemacht. In welchem Dorf war das?",
    },
    kaart: {
      namenTonen: true,
      // begin- en eindpunten van de etappes; de lijn volgt de route ongeveer
      route: [[46.484, 13.785], [46.461, 13.937], [46.436, 14.053], [46.374, 14.205], [46.344, 14.174], [46.368, 14.114], [46.333, 13.965], [46.29, 13.89], [46.273, 13.955], [46.213, 13.96], [46.15, 13.875], [46.152, 13.744], [46.183, 13.733], [46.247, 13.579], [46.338, 13.552], [46.405, 13.597], [46.442, 13.567], [46.505, 13.585], [46.484, 13.785]],
      pinnen: [
        { naam: { nl: "Kranjska Gora" }, lat: 46.484, lon: 13.785, kant: "onder", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Mojstrana" }, lat: 46.461, lon: 13.937, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Jesenice" }, lat: 46.436, lon: 14.053, kant: "links", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Begunje" }, lat: 46.374, lon: 14.205, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        {
          naam: { nl: "Radovljica" }, lat: 46.344, lon: 14.174, kant: "onder", juist: true,
          tekst: {
            nl: "Hier, in Radovljica, werd het aanzoek gedaan.",
            fr: "C'est ici, à Radovljica, qu'a eu lieu la demande en mariage.",
            en: "This is where the proposal happened, in Radovljica.",
            de: "Hier, in Radovljica, fand der Heiratsantrag statt.",
          },
          fotos: ["fotos/selfie-in-tent.jpg"],
        },
        { naam: { nl: "Bled" }, lat: 46.368, lon: 14.114, kant: "links", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Goreljek (Pokljuka)" }, lat: 46.333, lon: 13.965, kant: "onder", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Stara Fužina" }, lat: 46.29, lon: 13.89, kant: "links", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Bohinjska Bistrica" }, lat: 46.273, lon: 13.955, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Podbrdo" }, lat: 46.213, lon: 13.96, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Grahovo ob Bači" }, lat: 46.15, lon: 13.875, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Most na Soči" }, lat: 46.152, lon: 13.744, kant: "onder", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Tolmin" }, lat: 46.183, lon: 13.733, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Kobarid" }, lat: 46.247, lon: 13.579, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Bovec" }, lat: 46.338, lon: 13.552, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Log pod Mangartom" }, lat: 46.405, lon: 13.597, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Cave del Predil" }, lat: 46.442, lon: 13.567, kant: "rechts", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
        { naam: { nl: "Tarvisio" }, lat: 46.505, lon: 13.585, kant: "boven", tekst: { nl: "Een ander dorp op de Juliana Trail.", fr: "Un autre village du Juliana Trail.", en: "Another village on the Juliana Trail.", de: "Ein anderes Dorf am Juliana Trail." } },
      ],
    },
    uitleg: {
      nl: "Het was in Radovljica.",
      fr: "C'était à Radovljica.",
      en: "It was in Radovljica.",
      de: "Es war in Radovljica.",
    },
    bravo: {
      nl: "In Radovljica!",
      fr: "À Radovljica !",
      en: "In Radovljica!",
      de: "In Radovljica!",
    },
    fotoNa: {
      foto: "fotos/selfie-in-tent.jpg",
      alt: { nl: "Selfie in de tent", fr: "Selfie dans la tente", en: "Selfie in the tent", de: "Selfie im Zelt" },
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
