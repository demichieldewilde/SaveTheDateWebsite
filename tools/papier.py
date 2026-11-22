"""Maakt de papierstructuur als vaste, naadloze afbeelding (grijs, gemengd met soft-light in de CSS).

Vroeger rekende de browser die structuur zelf uit met een SVG-lichteffect, maar dat valt op
schermen met meer pixels (gsm) donkerder uit. Een vaste afbeelding ziet er overal hetzelfde uit.
Gebruik: python tools/papier.py  -> zet --papier-vezel en --papier-vezel-zacht in css/style.css
"""
import base64, io, re
from pathlib import Path
import numpy as np
from PIL import Image

N = 320
rng = np.random.default_rng(4)

def ruis(freq_lo, freq_hi, macht):
    """naadloze ruis: willekeurig spectrum, beperkt tot een frequentieband"""
    f = np.fft.fftfreq(N)[:, None] ** 2 + np.fft.fftfreq(N)[None, :] ** 2
    f = np.sqrt(f)
    band = ((f >= freq_lo) & (f <= freq_hi)) / np.maximum(f, 1e-6) ** macht
    spec = (rng.normal(size=(N, N)) + 1j * rng.normal(size=(N, N))) * band
    r = np.real(np.fft.ifft2(spec))
    return (r - r.mean()) / r.std()

def reliëf(hoogte):
    # licht schuin van linksboven, zoals het oude lichteffect (azimut 45°)
    dx = np.roll(hoogte, -1, 1) - np.roll(hoogte, 1, 1)
    dy = np.roll(hoogte, -1, 0) - np.roll(hoogte, 1, 0)
    return -(dx + dy)

def maak(naam, gem, sd):
    fijn = ruis(.08, .5, .3)          # korrel van het papier
    vezel = ruis(.01, .06, .8)        # grotere vlekken en vezels
    schaduw = reliëf(.7 * fijn + .6 * vezel)
    schaduw = (schaduw - schaduw.mean()) / schaduw.std() * sd + gem
    im = Image.fromarray(np.clip(schaduw, 0, 255).astype(np.uint8), "L")
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=82, optimize=True)
    data = base64.b64encode(buf.getvalue()).decode()
    css = Path(__file__).resolve().parent.parent / "css" / "style.css"
    tekst = css.read_text(encoding="utf-8")
    tekst, n = re.subn(rf"^  --{naam}: url\(.*\);$", f'  --{naam}: url("data:image/jpeg;base64,{data}");', tekst, flags=re.M)
    assert n == 1, naam
    css.write_text(tekst, encoding="utf-8", newline="")
    print(naam, len(data) // 1024, "KB")

maak("papier-vezel", 186, 17)
maak("papier-vezel-zacht", 187, 7)
