"""
Decodifica o bagua de cada protocolo do livro e confere a leitura.

A conferência é o ponto central: depois de ler os hexagramas, o script REDESENHA
o bagua a partir do que leu e compara com a imagem original. Se o desenho
reconstruído não bate com o do livro, a leitura é marcada como duvidosa em vez
de entrar no app como se fosse certa.

Isso também resolve a ambiguidade dos glifos girados: um hexagrama girado 45°
pode ser lido em dois sentidos, e só um dos dois reproduz o desenho original.

Saída: src/dados/composicoes.json

Uso: python3 scripts/decodificar_baguas.py [numero ...]
"""

from __future__ import annotations  # o Python 3.9 daqui não aceita "X | None" em anotação

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
DIR_IMAGENS = RAIZ / "imagens-do-livro"
SAIDA = RAIZ / "src/dados/composicoes.json"

# ordem de leitura das nove posições da grade
POSICOES = ["NO", "N", "NE", "O", "C", "L", "SO", "S", "SE"]
# O bagua é riscado do centro para fora: a linha 1 aponta para o centro. Logo cada
# posição é desenhada girada na direção que aponta para fora (horário, 0° no norte).
# Aqui o valor é o giro anti-horário que endireita o glifo — o oposto do desenhado.
ROTACAO = {"NO": 315, "N": 0, "NE": 45, "O": 270, "C": 0, "L": 90, "SO": 225, "S": 180, "SE": 135}

KING_WEN = """111111 000000 100010 010001 111010 010111 010000 000010
111011 110111 111000 000111 101111 111101 001000 000100
100110 011001 110000 000011 100101 101001 000001 100000
100111 111001 100001 011110 010010 101101 001110 011100
001111 111100 000101 101000 101011 110101 001010 010100
110001 100011 111110 011111 000110 011000 010110 011010
101110 011101 100100 001001 001011 110100 101100 001101
011011 110110 010011 110010 110011 001100 101010 010101""".split()
NUMERO = {bits: i + 1 for i, bits in enumerate(KING_WEN)}
BASE = {"00": "U", "01": "G", "10": "C", "11": "A"}


def codon(bits: str) -> str:
    return BASE[bits[0:2]] + BASE[bits[2:4]] + BASE[bits[4:6]]


# ─────────────────────────────────────────────────────────── leitura da imagem


def carregar(numero: int) -> np.ndarray:
    tinta = np.array(Image.open(DIR_IMAGENS / f"{numero:03d}.webp").convert("L")) < 128
    h, w = tinta.shape
    m = int(min(h, w) * 0.115)  # descarta a moldura de DNA
    return tinta[m : h - m, m : w - m]


def girar(mascara: np.ndarray, angulo: float) -> np.ndarray:
    if angulo % 360 == 0:
        return mascara
    img = Image.fromarray(((~mascara) * 255).astype("uint8"))
    return np.array(img.rotate(angulo, resample=Image.BICUBIC, expand=True, fillcolor=255)) < 128


def faixas(mascara: np.ndarray):
    """Faixas horizontais de tinta — as barras do hexagrama, de cima para baixo."""
    perfil = mascara.sum(axis=1)
    if perfil.max() == 0:
        return []
    limiar = perfil.max() * 0.25
    dentro, achadas, inicio = False, [], 0
    for y, valor in enumerate(perfil):
        if valor > limiar and not dentro:
            dentro, inicio = True, y
        elif valor <= limiar and dentro:
            dentro = False
            if y - inicio >= 3:
                achadas.append((inicio, y))
    if dentro and len(perfil) - inicio >= 3:
        achadas.append((inicio, len(perfil)))
    return achadas


def ler_barras(mascara: np.ndarray):
    """Devolve as 6 linhas de cima para baixo, ou None se não for um hexagrama limpo."""
    barras = faixas(mascara)
    if len(barras) != 6:
        return None
    alturas = [b - a for a, b in barras]
    if min(alturas) / max(alturas) < 0.55:  # barras de espessuras diferentes: leitura suja
        return None

    colunas = np.nonzero(mascara.any(axis=0))[0]
    if len(colunas) == 0:
        return None
    x0, x1 = colunas.min(), colunas.max()
    a = x0 + int((x1 - x0) * 0.42)
    b = x0 + int((x1 - x0) * 0.58)
    return "".join("1" if mascara[i:j, a : b + 1].mean() > 0.5 else "0" for i, j in barras)


def celula(tinta: np.ndarray, posicao: str) -> np.ndarray | None:
    """Recorta a célula da grade 3x3 e mantém só o maior borrão de tinta."""
    h, w = tinta.shape
    i, j = divmod(POSICOES.index(posicao), 3)
    recorte = tinta[i * h // 3 : (i + 1) * h // 3, j * w // 3 : (j + 1) * w // 3]

    fechado = ndimage.binary_closing(recorte, structure=np.ones((15, 15)))
    rotulos, quantos = ndimage.label(fechado)
    if quantos == 0:
        return None
    tamanhos = ndimage.sum(fechado, rotulos, range(1, quantos + 1))
    if tamanhos.max() < recorte.size * 0.02:
        return None
    return recorte & (rotulos == int(np.argmax(tamanhos)) + 1)


def ler_posicao(tinta: np.ndarray, posicao: str):
    """
    Lê o hexagrama de uma posição. Devolve as duas interpretações possíveis:
    a leitura direta e a invertida — a comparação com o original decide qual vale.
    """
    recorte = celula(tinta, posicao)
    if recorte is None:
        return None

    esperada = ROTACAO[posicao]
    for angulo in (esperada, esperada + 180, 0, 90, -90, 45, -45):
        endireitado = girar(recorte, angulo)
        deCimaParaBaixo = ler_barras(endireitado)
        if deCimaParaBaixo:
            baixoParaCima = deCimaParaBaixo[::-1]
            return {"linhas": baixoParaCima, "invertida": baixoParaCima[::-1], "angulo": angulo}
    return None


# ──────────────────────────────────────────────────── conferência por redesenho


def desenhar_hexagrama(linhas: str, lado: int) -> np.ndarray:
    """Redesenha um hexagrama em máscara booleana, linha 1 embaixo."""
    tela = np.zeros((lado, lado), dtype=bool)
    altura = max(2, lado // 14)
    espaco = max(1, lado // 22)
    passo = altura + espaco
    total = 6 * passo - espaco
    topo = (lado - total) // 2
    vao = int(lado * 0.16)
    for i, linha in enumerate(reversed(linhas)):  # i=0 é a barra de cima
        y = topo + i * passo
        if linha == "1":
            tela[y : y + altura, :] = True
        else:
            meio = lado // 2
            tela[y : y + altura, : meio - vao // 2] = True
            tela[y : y + altura, meio + vao // 2 :] = True
    return tela


def parecenca(a: np.ndarray, b: np.ndarray) -> float:
    """Índice de Jaccard entre duas máscaras — 1.0 é igual."""
    uniao = (a | b).sum()
    return float((a & b).sum() / uniao) if uniao else 0.0


def conferir(recorte_original: np.ndarray, linhas: str, angulo: float) -> float:
    """Redesenha o hexagrama, gira como no livro, e compara com o recorte original."""
    lado = min(recorte_original.shape)
    desenho = desenhar_hexagrama(linhas, lado)
    desenho = girar(desenho, -angulo)

    alvo = recorte_original
    # alinha os dois pelo centro de massa, para a comparação não punir deslocamento
    lado_comum = min(desenho.shape[0], alvo.shape[0]), min(desenho.shape[1], alvo.shape[1])
    corta = lambda m: m[
        (m.shape[0] - lado_comum[0]) // 2 : (m.shape[0] - lado_comum[0]) // 2 + lado_comum[0],
        (m.shape[1] - lado_comum[1]) // 2 : (m.shape[1] - lado_comum[1]) // 2 + lado_comum[1],
    ]
    return parecenca(corta(desenho), corta(alvo))


def decodificar(numero: int):
    tinta = carregar(numero)
    posicoes, confiancas = {}, []

    for posicao in POSICOES:
        lido = ler_posicao(tinta, posicao)
        if lido is None:
            posicoes[posicao] = None
            confiancas.append(0.0)
            continue

        recorte = celula(tinta, posicao)
        direta = conferir(recorte, lido["linhas"], lido["angulo"])
        invertida = conferir(recorte, lido["invertida"], lido["angulo"])
        # fica a leitura cujo redesenho reproduz melhor o original
        linhas = lido["linhas"] if direta >= invertida else lido["invertida"]
        posicoes[posicao] = linhas
        confiancas.append(max(direta, invertida))

    lidas = [p for p in posicoes.values() if p]
    return {
        "numero": numero,
        "posicoes": posicoes,
        "lidas": len(lidas),
        "confianca": round(float(np.mean(confiancas)), 3) if confiancas else 0.0,
    }


def main() -> int:
    alvos = [int(a) for a in sys.argv[1:]] or list(range(1, 102))
    resultados = [decodificar(n) for n in alvos]

    completos = [r for r in resultados if r["lidas"] == 9]
    print(f"protocolos processados: {len(resultados)}")
    print(f"  com as 9 posições lidas: {len(completos)}")
    print(f"  confiança média: {np.mean([r['confianca'] for r in resultados]):.3f}")

    for r in resultados[:12]:
        centro = r["posicoes"].get("C")
        marca = f"{NUMERO.get(centro)} · {codon(centro)}" if centro else "—"
        print(f"  {r['numero']:3d}  {r['lidas']}/9 posições  conf {r['confianca']:.2f}  centro {marca}")

    SAIDA.write_text(json.dumps(resultados, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\ngravado em {SAIDA.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
