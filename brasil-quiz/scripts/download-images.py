# Baixa e reduz as fotos listadas em data/places.json para ../public/onde-e-isso/img/<id>.jpg
# Uso: python3 scripts/download-images.py
import io, re, json, os, sys, time, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(ROOT), "public", "onde-e-isso", "img")
UA = "BrasilQuiz/1.0 (jogo de adivinhar lugares do Brasil)"
os.makedirs(OUT, exist_ok=True)


def thumb_url(p):
    # 960px é um tamanho padrão do Wikimedia: já fica em cache.
    # Outros tamanhos (e o original) tomam 429 rapidinho.
    url = p["image"]["url"].split("?")[0]
    if "/thumb/" in url:
        return re.sub(r"/\d+px-", "/960px-", url)
    if p["image"]["width"] > 960:
        head, name = url.rsplit("/", 1)
        return head.replace("/commons/", "/commons/thumb/", 1) + "/" + name + "/960px-" + name
    return url


places = json.load(open(os.path.join(ROOT, "data", "places.json")))
failed = []
for p in places:
    dest = os.path.join(OUT, p["id"] + ".jpg")
    if os.path.exists(dest):
        continue
    data = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(thumb_url(p), headers={"User-Agent": UA})
            data = urllib.request.urlopen(req, timeout=60).read()
            break
        except Exception as e:
            print(f"  {p['name']}: {e}", file=sys.stderr)
            time.sleep(5 * 2 ** attempt)
    if data is None:
        failed.append(p["name"])
        continue
    im = Image.open(io.BytesIO(data)).convert("RGB")
    im.thumbnail((1280, 1280))
    im.save(dest, "JPEG", quality=76, optimize=True, progressive=True)
    print(f"ok {p['name']} ({os.path.getsize(dest) // 1024} KB)")
    time.sleep(0.5)

if failed:
    sys.exit("sem foto: " + ", ".join(failed))
