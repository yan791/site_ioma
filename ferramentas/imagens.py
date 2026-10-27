"""Recorta e exporta as fotos reais do IOMA (tiradas do Instagram) para o site.

Uso: python ferramentas/imagens.py
Fonte: ioma/material-instagram (bruto, fora da pasta publicada)
Saída: ioma/site/public/img/<nome>-<largura>.webp e ioma/site/src/dados/imagens.json

Os casos clínicos não recebem ajuste de cor: o resultado precisa aparecer como é.
Os recortes tiram os textos e o logo que os posts trazem por cima da foto.
"""
import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

RAIZ = Path(__file__).resolve().parents[1]
BRUTO = RAIZ / "material-instagram"
SAIDA = RAIZ / "site" / "public" / "img"
MAPA = RAIZ / "site" / "src" / "dados" / "imagens.json"

# caixa = (esquerda, topo, direita, base) em fração da imagem original
CASOS = {
    # antes e depois vêm empilhados no mesmo post; as duas metades usam caixas do mesmo tamanho
    "protocolo": dict(src="DObURy6CY9J.jpg", antes=(0.09, 0.05, 0.85, 0.40), depois=(0.09, 0.565, 0.85, 0.915)),
    "provisorio": dict(src="Db5x4VuRRs8.jpg", antes=(0.05, 0.03, 0.95, 0.40), depois=(0.05, 0.54, 0.95, 0.91)),
    "coroa": dict(src="DcJePPyx1m0.jpg", antes=(0, 0.04, 1, 0.42), depois=(0, 0.55, 1, 0.93)),
    "fratura": dict(src="DcmQyVvJhsD.jpg", antes=(0, 0.02, 1, 0.38), depois=(0, 0.525, 1, 0.885)),
    "acrescimos": dict(src="DdUp2RPkZtY.jpg", antes=(0, 0.02, 1, 0.40), depois=(0, 0.52, 1, 0.90)),
}

FOTOS = {
    "dr-guilherme": dict(src="DXP0IRbJKBn.jpg", box=(0, 0.10, 1, 0.70), larguras=[520, 960]),
    "dr-guilherme-caso": dict(src="DcBnuygJi6S.jpg", box=(0, 0.30, 1, 0.96), larguras=[520, 960]),
    "dr-gui-cafe": dict(src="DctqrLDJx0K.jpg", box=(0, 0.10, 1, 0.70), larguras=[480, 720]),
    "dra-julia": dict(src="DcwQbRAB1ay.jpg", box=(0, 0.06, 1, 0.57), larguras=[480, 860]),
    "vaneide": dict(src="DYSwzcKpnsd.jpg", box=(0, 0.11, 1, 0.65), larguras=[480, 860]),
    "paciente-depoimento": dict(src="DcT7pxOJMKf.jpg", box=(0, 0.27, 1, 0.98), larguras=[480, 860]),
    "procedimento": dict(src="DcRMw4sRdft.jpg", box=(0, 0.27, 1, 0.64), larguras=[720, 1320]),
    # fotos do consultório enviadas pelo cliente (pasta fotos-consultorio)
    "consultorio-vista": dict(src="../fotos-consultorio/ioma3.webp", box=(0, 0, 1, 1), larguras=[640, 1360]),
    "consultorio-bancada": dict(src="../fotos-consultorio/ioma4.webp", box=(0, 0, 1, 1), larguras=[640, 1360]),
    "consultorio-anoitecer": dict(src="../fotos-consultorio/ioma1.webp", box=(0, 0.1, 1, 0.9), larguras=[640, 1360]),
    "recepcao": dict(src="../fotos-consultorio/ioma6.webp", box=(0, 0, 1, 1), larguras=[640, 1360]),
    "consultorio-sala": dict(src="../fotos-consultorio/ioma2.webp", box=(0, 0.12, 1, 0.82), larguras=[720, 1360]),
}

LARGURAS_CASO = [640, 1200]


def recortar(im, box):
    w, h = im.size
    return im.crop((round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h)))


def exportar(im, nome, larguras, qualidade=80, nitidez=True):
    saidas = []
    for lw in larguras:
        lw = min(lw, im.width)
        lh = round(im.height * lw / im.width)
        r = im.resize((lw, lh), Image.LANCZOS)
        if nitidez:
            r = r.filter(ImageFilter.UnsharpMask(radius=0.8, percent=40, threshold=2))
        arq = f"{nome}-{lw}.webp"
        r.save(SAIDA / arq, "WEBP", quality=qualidade, method=6)
        saidas.append({"src": f"img/{arq}", "w": lw, "h": lh})
    return saidas


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    mapa = {}
    for nome, c in CASOS.items():
        im = Image.open(BRUTO / c["src"]).convert("RGB")
        a = recortar(im, c["antes"])
        d = recortar(im, c["depois"])
        # garante o mesmo tamanho exato nas duas metades (o comparador sobrepõe uma na outra)
        d = d.resize(a.size, Image.LANCZOS) if d.size != a.size else d
        mapa[f"{nome}-antes"] = exportar(a, f"{nome}-antes", LARGURAS_CASO)
        mapa[f"{nome}-depois"] = exportar(d, f"{nome}-depois", LARGURAS_CASO)
    for nome, f in FOTOS.items():
        im = Image.open(BRUTO / f["src"]).convert("RGB")
        r = recortar(im, f["box"])
        # retratos: um toque de calor e contraste para conversar com a paleta oliva e champanhe
        r = ImageEnhance.Contrast(r).enhance(1.03)
        r = ImageEnhance.Color(r).enhance(0.96)
        mapa[nome] = exportar(r, nome, f["larguras"], qualidade=78)
    MAPA.parent.mkdir(parents=True, exist_ok=True)
    MAPA.write_text(json.dumps(mapa, indent=1), encoding="utf-8")
    total = sum(p.stat().st_size for p in SAIDA.glob("*.webp"))
    print(f"{len(mapa)} imagens, {total / 1024:.0f} KB no total")


if __name__ == "__main__":
    main()
