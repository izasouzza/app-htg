"""
Lê os hexagramas desenhados em cada imagem de protocolo.

Cada glifo é um grupo de 3 ou 6 barras; barra inteira = yang (1), barra partida = yin (0).
Os glifos aparecem girados em 0°, 45°, 90° ou 135°, então testamos as quatro rotações
e ficamos com a que produz barras limpas.

Uso: python3 scripts/ler_hexagramas.py [numero-do-protocolo ...]
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
DIR_IMAGENS = RAIZ / "imagens-do-livro"

# King Wen, linhas de baixo para cima, 1 = yang. Ordem igual à do bloco Unicode U+4DC0.
KING_WEN = """111111 000000 100010 010001 111010 010111 010000 000010
111011 110111 111000 000111 101111 111101 001000 000100
100110 011001 110000 000011 100101 101001 000001 100000
100111 111001 100001 011110 010010 101101 001110 011100
001111 111100 000101 101000 101011 110101 001010 010100
110001 100011 111110 011111 000110 011000 010110 011010
101110 011101 100100 001001 001011 110100 101100 001101
011011 110110 010011 110010 110011 001100 101010 010101""".split()

NUMERO_POR_BITS = {bits: i + 1 for i, bits in enumerate(KING_WEN)}

TRIGRAMAS = {
    "111": ("Céu", "☰"), "110": ("Lago", "☱"), "101": ("Fogo", "☲"), "100": ("Trovão", "☳"),
    "011": ("Vento", "☴"), "010": ("Água", "☵"), "001": ("Montanha", "☶"), "000": ("Terra", "☷"),
}


def carregar(numero: int) -> np.ndarray:
    img = Image.open(DIR_IMAGENS / f"{numero:03d}.webp").convert("L")
    return np.array(img) < 128


def remover_moldura(tinta: np.ndarray) -> np.ndarray:
    h, w = tinta.shape
    m = int(min(h, w) * 0.115)
    return tinta[m : h - m, m : w - m]


def separar_glifos(tinta: np.ndarray, folga: int = 21):
    """Funde as barras de um mesmo glifo e devolve as máscaras de cada glifo."""
    fundido = ndimage.binary_closing(tinta, structure=np.ones((folga, folga)))
    rotulos, total = ndimage.label(fundido)
    area_minima = tinta.size * 0.002
    glifos = []
    for i in range(1, total + 1):
        mascara = rotulos == i
        if mascara.sum() < area_minima:
            continue
        ys, xs = np.nonzero(mascara)
        glifos.append(
            {
                "tinta": tinta & mascara,
                "caixa": (ys.min(), ys.max(), xs.min(), xs.max()),
                "centro": (float(ys.mean()), float(xs.mean())),
            }
        )
    return glifos


def girar(tinta: np.ndarray, angulo: int) -> np.ndarray:
    if angulo % 360 == 0:
        return tinta
    img = Image.fromarray(((~tinta) * 255).astype("uint8"))
    girada = img.rotate(angulo, resample=Image.BICUBIC, expand=True, fillcolor=255)
    return np.array(girada) < 128


def faixas_de_barras(tinta: np.ndarray):
    perfil = tinta.sum(axis=1)
    if perfil.max() == 0:
        return []
    limiar = perfil.max() * 0.25
    faixas, dentro, inicio = [], False, 0
    for y, valor in enumerate(perfil):
        if valor > limiar and not dentro:
            dentro, inicio = True, y
        elif valor <= limiar and dentro:
            dentro = False
            if y - inicio >= 3:
                faixas.append((inicio, y))
    if dentro and len(perfil) - inicio >= 3:
        faixas.append((inicio, len(perfil)))
    return faixas


def ler_linhas(tinta: np.ndarray, faixas):
    """Para cada barra: inteira (yang) ou partida ao meio (yin). Devolve de cima para baixo."""
    colunas = np.nonzero(tinta.any(axis=0))[0]
    if len(colunas) == 0:
        return None
    x0, x1 = colunas.min(), colunas.max()
    meio_ini = x0 + int((x1 - x0) * 0.42)
    meio_fim = x0 + int((x1 - x0) * 0.58)

    linhas = []
    for a, b in faixas:
        faixa = tinta[a:b, meio_ini:meio_fim + 1]
        linhas.append("1" if faixa.mean() > 0.5 else "0")
    return "".join(linhas)


def decodificar_glifo(glifo):
    """Testa as quatro rotações e devolve a leitura mais limpa."""
    melhor = None
    for angulo in (0, 45, 90, 135):
        girado = girar(glifo["tinta"], angulo)
        faixas = faixas_de_barras(girado)
        if len(faixas) not in (3, 6):
            continue
        alturas = [b - a for a, b in faixas]
        # barras de um mesmo glifo têm espessura parecida; isso descarta rotações ruins
        regularidade = min(alturas) / max(alturas)
        if regularidade < 0.5:
            continue
        leitura = ler_linhas(girado, faixas)
        if leitura is None:
            continue
        candidato = {
            "angulo": angulo,
            "de_cima_para_baixo": leitura,
            "regularidade": round(regularidade, 3),
            "tipo": "hexagrama" if len(leitura) == 6 else "trigrama",
        }
        if melhor is None or regularidade > melhor["regularidade"]:
            melhor = candidato
    return melhor


def posicao_bagua(centro, forma):
    """Nomeia a posição do glifo na grade 3x3 (NO, N, NE, O, C, L, SO, S, SE)."""
    y, x = centro
    h, w = forma
    linha = 0 if y < h / 3 else (1 if y < 2 * h / 3 else 2)
    coluna = 0 if x < w / 3 else (1 if x < 2 * w / 3 else 2)
    return ["NO", "N", "NE", "O", "C", "L", "SO", "S", "SE"][linha * 3 + coluna]


def ler_protocolo(numero: int):
    tinta = remover_moldura(carregar(numero))
    glifos = separar_glifos(tinta)
    lidos = []
    for glifo in glifos:
        decodificado = decodificar_glifo(glifo)
        item = {
            "posicao": posicao_bagua(glifo["centro"], tinta.shape),
            "centro": glifo["centro"],
        }
        if decodificado is None:
            item["falha"] = True
        else:
            item.update(decodificado)
            # convenção do I Ching: a primeira linha é a de baixo
            baixo_para_cima = decodificado["de_cima_para_baixo"][::-1]
            item["baixo_para_cima"] = baixo_para_cima
            if decodificado["tipo"] == "hexagrama":
                item["reiWen"] = NUMERO_POR_BITS.get(baixo_para_cima)
            else:
                item["trigrama"] = TRIGRAMAS.get(baixo_para_cima, ("?", "?"))[0]
        lidos.append(item)
    lidos.sort(key=lambda g: (g["centro"][0], g["centro"][1]))
    return lidos


def main():
    alvos = [int(a) for a in sys.argv[1:]] or [2]
    for numero in alvos:
        print(f"\n===== protocolo {numero:03d}")
        for g in ler_protocolo(numero):
            if g.get("falha"):
                print(f"  {g['posicao']:2s}  não decodificado")
            elif g["tipo"] == "hexagrama":
                print(
                    f"  {g['posicao']:2s}  giro {g['angulo']:3d}°  "
                    f"{g['baixo_para_cima']}  Rei Wen {g['reiWen']}  (reg {g['regularidade']})"
                )
            else:
                print(
                    f"  {g['posicao']:2s}  giro {g['angulo']:3d}°  "
                    f"{g['baixo_para_cima']}  trigrama {g['trigrama']}  (reg {g['regularidade']})"
                )


if __name__ == "__main__":
    main()
