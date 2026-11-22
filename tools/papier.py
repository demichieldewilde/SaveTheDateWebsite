"""Maakt de papierstructuur als vaste, naadloze, doorzichtige afbeelding.

Witte lichtjes en zwarte schaduwtjes met een beetje doorzichtigheid, gewoon bovenop de kleur gelegd.
Er is dus geen mengmodus (soft-light) nodig: die past Safari op iPhone niet altijd toe, waardoor het
papier daar volledig grijs werd. Zo ziet het er op elke browser en elk scherm hetzelfde uit.

Gebruik: python tools/papier.py  -> zet --papier-vezel en --papier-vezel-zacht in css/style.css
"""
import base64
import io
import re
from pathlib import Path

import numpy as np
from PIL import Image

N = 320
rng = np.random.default_rng(4)


def ruis(freq_lo, freq_hi, macht):
    """naadloze ruis: willekeurig spectrum, beperkt tot een frequentieband"""
    f = np.sqrt(np.fft.fftfreq(N)[:, None] ** 2 + np.fft.fftfreq(N)[None, :] ** 2)
    band = ((f >= freq_lo) & (f <= freq_hi)) / np.maximum(f, 1e-6) ** macht
    spec = (rng.normal(size=(N, N)) + 1j * rng.normal(size=(N, N))) * band
    r = np.real(np.fft.ifft2(spec))
    return (r - r.mean()) / r.std()


def reliëf(hoogte):
    # licht schuin van linksboven (azimut 45°)
    dx = np.roll(hoogte, -1, 1) - np.roll(hoogte, 1, 1)
    dy = np.roll(hoogte, -1, 0) - np.roll(hoogte, 1, 0)
    r = -(dx + dy)
    return (r - r.mean()) / r.std()


FIJN = ruis(.08, .5, .3)    # korrel van het papier
VEZEL = ruis(.01, .06, .8)  # grotere vlekken en vezels
RELIËF = reliëf(.7 * FIJN + .6 * VEZEL)


def maak(naam, sterkte):
    """sterkte: hoeveel dekking één standaardafwijking reliëf krijgt (0.05 = 5% wit of zwart)"""
    # een paar tinten volstaan (palet-PNG): dat houdt het bestand klein
    stappen = 7
    trede = np.clip(np.round(np.abs(RELIËF) / 2.5 * stappen), 0, stappen).astype(np.uint8)
    index = np.where(RELIËF > 0, trede, trede + stappen + 1).astype(np.uint8)  # 0..7 wit, 8..15 zwart
    alfa = [round(min(1, i / stappen * 2.5 * sterkte) * 255) for i in range(stappen + 1)]
    im = Image.fromarray(index, "P")
    im.putpalette([255, 255, 255] * (stappen + 1) + [0, 0, 0] * (stappen + 1))
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True, transparency=bytes(alfa + alfa))
    data = base64.b64encode(buf.getvalue()).decode()
    css = Path(__file__).resolve().parent.parent / "css" / "style.css"
    tekst = css.read_text(encoding="utf-8")
    tekst, n = re.subn(rf"^  --{naam}: url\(.*\);$", f'  --{naam}: url("data:image/png;base64,{data}");', tekst, flags=re.M)
    assert n == 1, naam
    css.write_bytes(tekst.encode("utf-8"))
    print(naam, len(data) // 1024, "KB")


maak("papier-vezel", .05)
maak("papier-vezel-zacht", .07)
