"""Tekent fotos/zegel.svg: een rood waszegel met onregelmatige rand en belichting.
Gebruik: python tools/zegel.py
"""
import math
import random
from pathlib import Path

random.seed(7)


def blob(cx, cy, r, amp, n=90, harm=((2, .35), (3, .5), (5, .3), (7, .2), (13, .08))):
    ph = [random.uniform(0, 6.28) for _ in harm]
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        d = r * (1 + amp * sum(w * math.sin(k * a + p) for (k, w), p in zip(harm, ph)))
        pts.append((cx + d * math.cos(a), cy + d * math.sin(a)))
    s = "M%.1f %.1f" % ((pts[0][0] + pts[-1][0]) / 2, (pts[0][1] + pts[-1][1]) / 2)
    for i in range(n):
        p, q = pts[i], pts[(i + 1) % n]
        s += " Q%.1f %.1f %.1f %.1f" % (p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
    return s + "Z"


# de was: een onregelmatige plas met een paar uitlopers
was = [blob(100, 100, 80, .07)]
for hoek, afstand, r in ((-.6, 70, 17), (2.2, 72, 14), (1.15, 76, 10), (3.9, 70, 15), (4.9, 76, 9)):
    was.append(blob(100 + afstand * math.cos(hoek), 100 + afstand * math.sin(hoek), r, .2, n=30))
was_paden = "".join(f'<path d="{d}"/>' for d in was)

stippen = "".join(
    f'<circle cx="{100 + 49 * math.cos(a):.1f}" cy="{100 + 49 * math.sin(a):.1f}" r="1.6"/>'
    for a in [i * 2 * math.pi / 40 for i in range(40)]
)


def licht(id_, blur, hoogte, glans):
    return f'''<filter id="{id_}" x="-15%" y="-15%" width="130%" height="130%">
<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}" result="h"/>
<feDiffuseLighting in="h" surfaceScale="{hoogte}" diffuseConstant="1.2" lighting-color="#fff" result="d"><feDistantLight azimuth="235" elevation="46"/></feDiffuseLighting>
<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.05" result="kleur"/>
<feSpecularLighting in="h" surfaceScale="{hoogte}" specularConstant="1" specularExponent="30" lighting-color="#FFE6E2" result="s"><fePointLight x="50" y="30" z="170"/></feSpecularLighting>
<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
<feComposite in="kleur" in2="s2" operator="arithmetic" k2="1" k3="{glans}" result="samen"/>
<feComposite in="samen" in2="SourceAlpha" operator="in"/>
</filter>'''


svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<defs>
<radialGradient id="kl" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#CC3A2C"/><stop offset=".6" stop-color="#A3211F"/><stop offset="1" stop-color="#6A100D"/></radialGradient>
<radialGradient id="kuil" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#C2402F"/><stop offset="1" stop-color="#9A261C"/></radialGradient>
{licht("was", 6, 7, .6)}
{licht("rand", 1.6, 2.5, .55)}
<filter id="zacht" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="binnenschaduw"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/><feOffset dx="2" dy="3"/><feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="s"/><feFlood flood-color="#3A0408" flood-opacity=".75"/><feComposite in2="s" operator="in"/><feComposite in2="SourceGraphic" operator="over"/></filter>
</defs>
<g opacity=".5" filter="url(#zacht)" transform="translate(2 5)">{was_paden}</g>
<g filter="url(#was)" fill="url(#kl)">{was_paden}</g>
<circle cx="100" cy="100" r="58" fill="url(#kuil)" filter="url(#binnenschaduw)"/>
<g filter="url(#rand)" fill="#AA2722"><path fill-rule="evenodd" d="M100 38a62 62 0 1 1 0 124a62 62 0 1 1 0-124ZM100 43a57 57 0 1 0 0 114a57 57 0 1 0 0-114Z"/>{stippen}</g>
</svg>'''

Path(__file__).resolve().parent.parent.joinpath("fotos", "zegel.svg").write_text(svg, encoding="utf-8")
print("fotos/zegel.svg geschreven")
