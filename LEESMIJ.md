# Save the date – Amélie & Michiel

Een statische website (HTML, CSS en JavaScript, zonder build-stap). Bezoekers spelen eerst een quiz, krijgen daarna de save-the-date-kaart te zien en kunnen zich registreren. De registraties komen in een Google Sheet terecht.

```
index.html                 de pagina
css/style.css              vormgeving (kleuren bovenaan)
js/config.js               ← ALLES OM AAN TE PASSEN: teksten, data, quizvragen
js/app.js                  de logica (normaal niet aan te raken)
fotos/                     foto's in webformaat
fotos-origineel/           de originele foto's (gaat niet mee naar GitHub)
google-apps-script/Code.gs het script voor de Google Sheet
tools/verklein-fotos.py    verkleint nieuwe foto's
```

## 1. Lokaal bekijken

Dubbelklikken op `index.html` werkt grotendeels. Beter is een klein servertje vanuit deze map:

```bash
python -m http.server 8321
```

Surf daarna naar http://localhost:8321.

## 2. Formulier koppelen aan een Google Sheet

1. Maak een nieuwe Google Sheet aan, bv. "Save the date registraties".
2. Ga naar **Extensies → Apps Script**.
3. Vervang alles in `Code.gs` door de inhoud van [google-apps-script/Code.gs](google-apps-script/Code.gs). Wil je per registratie een mail krijgen, vul dan `MELDING_NAAR` in.
4. Klik op **Implementeren → Nieuwe implementatie**.
   - Type: **Web-app**
   - Uitvoeren als: **Ik**
   - Wie heeft toegang: **Iedereen**
5. Geef toestemming (Google waarschuwt dat de app "niet geverifieerd" is: kies *Geavanceerd → Ga naar … (onveilig)*. Het is jullie eigen script).
6. Kopieer de URL van de web-app (eindigt op `/exec`) en plak die in `js/config.js` bij `formulierUrl`.
7. Test: open die URL in je browser. Je zou `{"ok":true,"bericht":"De koppeling werkt."}` moeten zien. Vul daarna het formulier één keer in op de site; het tabblad *Registraties* verschijnt dan vanzelf.

Pas je het script later aan? Kies dan **Implementeren → Implementaties beheren → ✏️ → Versie: Nieuwe versie**. Zo blijft de URL dezelfde.

## 3. Online zetten met GitHub Pages

1. Maak een (publieke) repository op GitHub, bv. `save-the-date`.
2. Upload alle bestanden van deze map (behalve `fotos-origineel/`).
3. Ga in de repo naar **Settings → Pages**, kies *Deploy from a branch*, branch `main`, map `/ (root)`.
4. Na een minuutje staat de site op `https://<gebruikersnaam>.github.io/save-the-date/`.

## 4. Twee soorten gasten: met of zonder diner

- **Iedereen** krijgt de gewone link: `https://<gebruikersnaam>.github.io/save-the-date/`
  Die gasten zien de kerk en het feest.
- **Dinergasten** krijgen de link met code: `https://<gebruikersnaam>.github.io/save-the-date/?k=lente`
  Zij zien ook het diner en kunnen dieetwensen doorgeven.

De code (`lente`) pas je aan bij `dinerCode` in `js/config.js`. In de sheet zie je in de kolom *Uitgenodigd voor* welke link iemand gebruikte. Opgelet: dit is een gemakkelijke drempel en geen echte beveiliging.

## 5. Dingen aanpassen

- **Kerklocatie, uren, enz.**: `js/config.js` → `kerk`, `diner`, `feest`. Een leeg veld toont automatisch "volgt nog".
- **Quizvragen**: `js/config.js` → `QUIZ`. Per vraag kies je tekst- of foto-antwoorden, welk antwoord juist is (`juist: 0` = het eerste) en de uitleg bij een fout antwoord.
- **Foto vervangen**: zet een nieuwe foto in `fotos/` met dezelfde naam, of verwijs in `config.js` naar een nieuwe naam. Voer daarna dit uit (nodig: `pip install pillow`), zodat de foto klein genoeg is:

  ```bash
  python tools/verklein-fotos.py
  ```
- **Kleuren**: bovenaan in `css/style.css`.
