"""Verkleint alle foto's in fotos/ naar webformaat (max 1400 px, ~200 KB).

Gebruik (vanuit de projectmap):  python tools/verklein-fotos.py
De originelen worden eerst gekopieerd naar fotos-origineel/ (die map gaat niet mee naar GitHub).
Foto's die al klein genoeg zijn, worden overgeslagen.
"""
import shutil
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "fotos"
BACKUP = ROOT / "fotos-origineel"
MAX_SIDE = 1400

BACKUP.mkdir(exist_ok=True)
for path in sorted(SRC.iterdir()):
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    with Image.open(path) as im:
        if max(im.size) <= MAX_SIDE:
            continue
        if not (BACKUP / path.name).exists():
            shutil.copy2(path, BACKUP / path.name)
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE))
        out = path.with_suffix(".jpg")
        im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    if out != path:
        path.unlink()
    print(f"{out.name}: {out.stat().st_size // 1024} KB")
