"""
Extrai os 101 protocolos do PDF do livro para o app.

Gera:
  imagens-do-livro/NNN.webp   — recorte da figura do protocolo, com moldura
  src/dados/protocolos.json    — título, palavras-chave, relações energéticas e notas

Requisitos:  python3 -m pip install --user pymupdf Pillow
Uso:         python3 scripts/extrair_protocolos.py [caminho-do-pdf]
"""

import io
import json
import re
import sys
from pathlib import Path

import fitz
from PIL import Image

PDF_PADRAO = Path.home() / "Desktop/Hexagrama Terapia Genetica/HTG-LIVRO-final.pdf"
RAIZ = Path(__file__).resolve().parent.parent
DIR_IMAGENS = RAIZ / "imagens-do-livro"
ARQ_JSON = RAIZ / "src/dados/protocolos.json"

# páginas do PDF (base 0) que contêm os protocolos 1 a 101
PRIMEIRA, ULTIMA = 17, 117
# a moldura de DNA é a mesma imagem em todas as páginas e delimita a figura
XREF_MOLDURA = 941
# 3x ≈ 216 dpi: nítido em tela retina sem inflar o app
ESCALA = 3


def limpa(texto: str) -> str:
    return re.sub(r"\s+", " ", texto.replace("\u00a0", " ")).strip()


def extrair_pagina(pagina) -> dict:
    moldura = pagina.get_image_rects(XREF_MOLDURA)[0]

    acima, dentro, abaixo = [], [], []
    for x0, y0, x1, y1, txt, *_ in pagina.get_text("blocks"):
        t = limpa(txt)
        if not t or y0 < 40 or y0 > 545:  # cabeçalho corrido e número de página
            continue
        # os rodapés de metadados às vezes começam colados na moldura
        if t.startswith(("Relações Energética", "Relação Energética", "Palavras-chave")):
            abaixo.append(t)
        elif y1 <= moldura.y0 + 2:
            acima.append(t)
        elif y0 >= moldura.y1 - 2:
            abaixo.append(t)
        else:
            dentro.append(t)

    # o título ocupa até duas linhas; a descrição, quando existe, começa com travessão
    titulo_bruto = limpa(" ".join(t for t in acima if not t.startswith("—")))
    descricao = limpa(" ".join(t.lstrip("— ") for t in acima if t.startswith("—")))

    m = re.match(r"^(\d+)\.\s*(.+)$", titulo_bruto)
    numero, resto = (int(m.group(1)), m.group(2).strip()) if m else (None, titulo_bruto)
    m2 = re.match(r"^(.+?)\s*\((.+)\)\s*$", resto)
    titulo, complemento = (m2.group(1).strip(), m2.group(2).strip()) if m2 else (resto, "")

    relacoes = next(
        (t for t in abaixo if t.startswith(("Relações Energética", "Relação Energética"))), ""
    )
    relacoes = re.sub(r"^Relaç(ões|ão) Energética:\s*", "", relacoes).strip()

    chaves_txt = re.sub(
        r"^Palavras-chave:\s*", "", next((t for t in abaixo if t.startswith("Palavras-chave")), "")
    )
    chaves = [c.strip(" .;,") for c in re.split(r"[;,]", chaves_txt)]
    chaves = [c for c in chaves if c and c != "..."]

    sugestao = next((t for t in dentro if t.startswith("Sugestão")), "")
    nota = next((t for t in dentro if t.startswith("(")), "")

    slug = f"{numero:03d}"
    pix = pagina.get_pixmap(clip=moldura, matrix=fitz.Matrix(ESCALA, ESCALA), colorspace=fitz.csGRAY)
    Image.open(io.BytesIO(pix.tobytes("png"))).save(
        DIR_IMAGENS / f"{slug}.webp", "WEBP", lossless=True, quality=90, method=6
    )

    return {
        "numero": numero,
        "titulo": titulo,
        "complemento": complemento,
        "descricao": descricao,
        "relacoes": relacoes,
        "palavrasChave": chaves,
        "sugestao": re.sub(r"^Sugestão:\s*", "", sugestao).strip(),
        "notaAplicacao": nota.strip("() "),
        "pagina": pagina.number + 1,
        "imagem": f"/protocolos/{slug}.webp",
    }


def main() -> int:
    caminho = Path(sys.argv[1]) if len(sys.argv) > 1 else PDF_PADRAO
    if not caminho.exists():
        print(f"PDF não encontrado: {caminho}")
        return 1

    DIR_IMAGENS.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(caminho)
    protocolos = [extrair_pagina(doc[n]) for n in range(PRIMEIRA, ULTIMA + 1)]

    ARQ_JSON.write_text(
        json.dumps(protocolos, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )

    print(f"{len(protocolos)} protocolos extraídos para {ARQ_JSON.relative_to(RAIZ)}")
    # o livro realmente não traz esses campos nestes protocolos; serve de conferência
    sem_relacoes = [p["numero"] for p in protocolos if not p["relacoes"]]
    sem_chaves = [p["numero"] for p in protocolos if not p["palavrasChave"]]
    print(f"  sem relações energéticas: {sem_relacoes} (esperado: [45])")
    print(f"  sem palavras-chave: {sem_chaves} (esperado: [29, 30])")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
