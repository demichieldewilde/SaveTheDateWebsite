/**
 * Ontvangt de registraties van de save-the-date-website en zet ze in deze Google Sheet.
 * Installatie: zie LEESMIJ.md, stap 2.
 */

const TABBLAD = "Registraties";

// Zet hier jullie e-mailadres om bij elke registratie een mailtje te krijgen (leeg = geen mail).
const MELDING_NAAR = "";

const KOLOMMEN = [
  ["tijdstip", "Tijdstip"],
  ["naam", "Naam"],
  ["email", "E-mail"],
  ["aanwezig", "Aanwezig"],
  ["aantal", "Aantal personen"],
  ["kerk", "Kerk"],
  ["diner", "Diner"],
  ["feest", "Feest"],
  ["dieet", "Dieetwensen"],
  ["bericht", "Bericht"],
  ["uitnodiging", "Uitgenodigd voor"],
  ["quizscore", "Quizscore"],
];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spamrobots vullen het verborgen veld 'website' in; die negeren we stilletjes.
  if (p.website) return antwoord({ ok: true });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const blad = tabblad();
    const rij = KOLOMMEN.map(([sleutel]) =>
      sleutel === "tijdstip" ? new Date() : veilig(p[sleutel])
    );
    blad.appendRow(rij);

    if (MELDING_NAAR) {
      MailApp.sendEmail(
        MELDING_NAAR,
        `Save the date: ${p.naam} (${p.aanwezig})`,
        KOLOMMEN.slice(1).map(([s, titel]) => `${titel}: ${p[s] || "-"}`).join("\n")
      );
    }
    return antwoord({ ok: true });
  } catch (err) {
    return antwoord({ ok: false, fout: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Handig om te testen: open de web-app-URL in je browser.
function doGet() {
  return antwoord({ ok: true, bericht: "De koppeling werkt." });
}

function tabblad() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let blad = ss.getSheetByName(TABBLAD);
  if (!blad) {
    blad = ss.insertSheet(TABBLAD);
    blad.appendRow(KOLOMMEN.map(([, titel]) => titel));
    blad.setFrozenRows(1);
    blad.getRange(1, 1, 1, KOLOMMEN.length).setFontWeight("bold");
  }
  return blad;
}

// Voorkomt dat iemand een formule (=...) in jullie sheet kan laten uitvoeren.
function veilig(waarde) {
  const tekst = String(waarde || "").slice(0, 2000);
  return /^[=+\-@]/.test(tekst) ? "'" + tekst : tekst;
}

function antwoord(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
