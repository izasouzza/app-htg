"""
Lê o desenho de um protocolo do livro e propõe o bloco de cadastro.

Reconhece os dois arranjos:
  • bagua  — nove glifos em roseta, cada um girado na direção que aponta para fora
  • linha  — uma ou mais fileiras de hexagramas

A fusão da tinta é direcional: primeiro só na vertical, que junta as barras de um
mesmo hexagrama sem encostar no vizinho ao lado; depois só na horizontal, para
fechar o vão central das linhas yin. Fundir em bloco quadrado cola glifos vizinhos
e foi a causa das leituras erradas.

Confere três regras antes de propor o cadastro:
  1. todos os glifos legíveis
  2. os códons de um aminoácido não se repetem dentro do mesmo bloco
  3. cada bloco traz a família completa do aminoácido

Uso: python3 scripts/ler_protocolo.py 9 [10 11 ...]
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
DIR_IMAGENS = RAIZ / "imagens-do-livro"

BASE = {"00": "U", "01": "G", "10": "C", "11": "A"}
TABELA = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"
CODIGO, _i = {}, 0
for _a in "UCAG":
    for _b in "UCAG":
        for _c in "UCAG":
            CODIGO[_a + _b + _c] = TABELA[_i]
            _i += 1
FAMILIA = Counter(CODIGO.values())
NOME = {
    "F": "fenilalanina", "L": "leucina", "I": "isoleucina", "M": "metionina", "V": "valina",
    "S": "serina", "P": "prolina", "T": "treonina", "A": "alanina", "Y": "tirosina",
    "H": "histidina", "Q": "glutamina", "N": "asparagina", "K": "lisina",
    "D": "ácido aspártico", "E": "ácido glutâmico", "C": "cisteína", "W": "triptofano",
    "R": "arginina", "G": "glicina", "*": "parada",
}
ORDEM = ["NO", "N", "NE", "O", "C", "L", "SO", "S", "SE"]
HORARIO = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"]
# giro que endireita cada posição: o bagua é riscado do centro para fora
GIRO = {"NO": 315, "N": 0, "NE": 45, "O": 270, "C": 0, "L": 90, "SO": 225, "S": 180, "SE": 135}


def codon(linhas: str) -> str:
    return BASE[linhas[0:2]] + BASE[linhas[2:4]] + BASE[linhas[4:6]]


def carregar(numero: int) -> np.ndarray:
    tinta = np.array(Image.open(DIR_IMAGENS / f"{numero:03d}.webp").convert("L")) < 128
    h, w = tinta.shape
    m = int(min(h, w) * 0.115)
    return tinta[m : h - m, m : w - m]


def girar(mascara: np.ndarray, angulo: int) -> np.ndarray:
    if angulo % 360 == 0:
        return mascara
    img = Image.fromarray(((~mascara) * 255).astype("uint8"))
    return np.array(img.rotate(angulo, resample=Image.BICUBIC, expand=True, fillcolor=255)) < 128


def bandas(perfil, limiar: float, minimo: int):
    dentro, achadas, inicio = False, [], 0
    for i, v in enumerate(perfil):
        if v > limiar and not dentro:
            dentro, inicio = True, i
        elif v <= limiar and dentro:
            dentro = False
            if i - inicio >= minimo:
                achadas.append((inicio, i))
    if dentro and len(perfil) - inicio >= minimo:
        achadas.append((inicio, len(perfil)))
    return achadas


def barras_de(glifo: np.ndarray):
    return bandas(glifo.sum(axis=1), glifo.sum(axis=1).max() * 0.25, 3)


def ler_hexagrama(glifo: np.ndarray, quantas: tuple[int, ...] = (6,)):
    """
    Devolve as linhas de baixo para cima, ou None se não sair limpo.

    `quantas` diz quantas barras o glifo deve ter: 6 para hexagrama, 3 para trigrama.
    """
    barras = barras_de(glifo)
    if len(barras) not in quantas:
        return None
    alturas = [b - a for a, b in barras]
    if min(alturas) / max(alturas) < 0.5:
        return None
    # Onde cada barra começa e termina, medido barra a barra. Um respingo do glifo
    # vizinho estica uma ou outra, mas não a maioria — daí a mediana, e não o extremo
    # do glifo inteiro: era o que deslocava a amostra para fora do vão do yin e fazia
    # uma linha partida passar por inteira.
    extremos = []
    for i, j in barras:
        colunas = np.nonzero(glifo[i:j].any(axis=0))[0]
        if len(colunas) == 0:
            return None
        extremos.append((colunas.min(), colunas.max()))
    x0 = int(np.median([e[0] for e in extremos]))
    x1 = int(np.median([e[1] for e in extremos]))
    if x1 <= x0:
        return None
    a = x0 + int((x1 - x0) * 0.42)
    b = x0 + int((x1 - x0) * 0.58)
    return "".join("1" if glifo[i:j, a : b + 1].mean() > 0.5 else "0" for i, j in barras)[::-1]


def juntar_metades(rotulos: np.ndarray, principal: int) -> np.ndarray:
    """
    Devolve a máscara do glifo, e não só do maior pedaço dele.

    Um hexagrama com todas as linhas partidas se separa em duas metades soltas; ficar com
    a maior daria seis barras inteiras — AAA no lugar de UUU. A outra metade se reconhece
    por acompanhar o glifo de ponta a ponta num eixo e estar encostada no outro. Vale para
    os dois eixos, porque no leste e no oeste o glifo está deitado e as metades se separam
    na vertical. Os respingos dos vizinhos, que chegam pelos cantos, não passam no teste.
    """
    fatias = ndimage.find_objects(rotulos)
    caixa = fatias[principal - 1]

    def encosta(fatia, eixo: int) -> bool:
        """Acompanha o glifo no eixo dado e está colado a ele no outro."""
        ao_longo, atraves = fatia[eixo], fatia[1 - eixo]
        p, q = caixa[eixo].start, caixa[eixo].stop
        juntos = min(q, ao_longo.stop) - max(p, ao_longo.start)
        if juntos < 0.8 * min(q - p, ao_longo.stop - ao_longo.start):
            return False
        # a escala é a largura, não a altura: um trigrama tem metade da altura de um
        # hexagrama, mas as duas metades se afastam igual — medir pela altura o excluiria
        largura = caixa[1 - eixo].stop - caixa[1 - eixo].start
        vao = max(caixa[1 - eixo].start - atraves.stop, atraves.start - caixa[1 - eixo].stop)
        return vao <= 0.5 * largura

    mascara = rotulos == principal
    for i, fatia in enumerate(fatias, start=1):
        if i == principal or fatia is None:
            continue
        if encosta(fatia, 0) or encosta(fatia, 1):
            mascara |= rotulos == i
    return mascara


def contar_pontos(cel: np.ndarray) -> int:
    """
    Quantos pontos redondos há na célula, ou 0 se não for um centro de pontos.

    Ponto é miúdo e redondo; barra de hexagrama é comprida. Serve para reconhecer os
    centros que o livro desenha com cinco pontos em cruz, no lugar do hexagrama.
    """
    rotulos, _ = ndimage.label(cel)
    alto_total, largo_total = cel.shape
    pontos = 0
    for fatia in ndimage.find_objects(rotulos):
        alto = fatia[0].stop - fatia[0].start
        largo = fatia[1].stop - fatia[1].start
        if not 0.6 <= alto / max(largo, 1) <= 1.6:
            continue
        if max(alto, largo) > 0.2 * min(cel.shape):
            continue
        # perto do meio: respingo de glifo vizinho chega pela borda da célula
        y = (fatia[0].start + fatia[0].stop) / 2 / alto_total
        x = (fatia[1].start + fatia[1].stop) / 2 / largo_total
        if not (0.1 < y < 0.9 and 0.1 < x < 0.9):
            continue
        pontos += 1
    return pontos if pontos >= 3 else 0


def ler_como_bagua(tinta: np.ndarray):
    """
    Lê as nove posições. Cada uma pode ser hexagrama ou trigrama; o centro pode ainda
    ser um punhado de pontos, que sai como o número deles ('5 pontos').
    """
    h, w = tinta.shape
    lido = {}
    for idx, pos in enumerate(ORDEM):
        r, c = divmod(idx, 3)
        cel = tinta[r * h // 3 : (r + 1) * h // 3, c * w // 3 : (c + 1) * w // 3]
        if pos == "C" and (pontos := contar_pontos(cel)):
            lido[pos] = f"{pontos} pontos"
            continue
        # endireitar antes de isolar: nas diagonais, as duas metades de uma linha yin se
        # afastam na diagonal, e aí nenhum teste de eixo as reconhece como do mesmo glifo
        reto = girar(cel, GIRO[pos])
        for folga in (15, 13, 11, 17, 19, 21):
            fechado = ndimage.binary_closing(reto, structure=np.ones((folga, folga)))
            rotulos, quantos = ndimage.label(fechado)
            if quantos == 0:
                continue
            tamanhos = ndimage.sum(fechado, rotulos, range(1, quantos + 1))
            if tamanhos.max() < reto.size * 0.02:
                continue
            só = reto & juntar_metades(rotulos, int(np.argmax(tamanhos)) + 1)
            linhas = ler_hexagrama(só, (6, 3))
            if linhas:
                lido[pos] = linhas
                break
        else:
            lido[pos] = None
    return lido


def glifos_da_imagem(tinta: np.ndarray, folga: int = 15):
    """Centro e tamanho de cada bloco de tinta grande o bastante para ser um glifo."""
    fechado = ndimage.binary_closing(tinta, structure=np.ones((folga, folga)))
    rotulos, quantos = ndimage.label(fechado)
    achados = []
    for i, fatia in enumerate(ndimage.find_objects(rotulos), start=1):
        alto = fatia[0].stop - fatia[0].start
        largo = fatia[1].stop - fatia[1].start
        if max(alto, largo) < 0.05 * min(tinta.shape):
            continue
        achados.append(((fatia[0].start + fatia[0].stop) / 2, (fatia[1].start + fatia[1].stop) / 2))
    return achados


def achar_roseta(tinta: np.ndarray):
    """
    Devolve (recorte, leitura) da roseta.

    Quando o desenho traz mais que o bagua — uma fileira solta, uma foto —, a roseta sai
    do meio do quadro e a grade de nove células erra o alvo. Aqui ela é localizada pela
    geometria: procura-se o bloco de tinta que tenha oito outros à mesma distância em
    volta. Achado o centro e o raio, o lado do quadrado sai da proporção medida no livro
    (o raio é 39% do lado).
    """
    direta = ler_como_bagua(tinta)
    if all(v is not None for v in direta.values()):
        return tinta, direta

    h, w = tinta.shape
    centros = glifos_da_imagem(tinta)
    melhor = (tinta, direta)

    # Cada par de glifos é um palpite: se forem opostos no anel, o meio deles é o centro
    # e a metade da distância é o raio. Vence o palpite com mais glifos nessa roda. Não se
    # exige um glifo no meio, porque em vários protocolos o centro é de pontos miúdos.
    palpites = []
    for i, (ay, ax) in enumerate(centros):
        for by, bx in centros[i + 1 :]:
            cy, cx = (ay + by) / 2, (ax + bx) / 2
            raio = np.hypot(ay - by, ax - bx) / 2
            if raio < 0.1 * min(h, w):
                continue
            na_roda = sum(
                1 for y, x in centros if abs(np.hypot(y - cy, x - cx) - raio) <= 0.15 * raio
            )
            if na_roda >= 6:
                palpites.append((na_roda, cy, cx, raio))

    # a proporção do livro dá o lado aproximado; um ajuste fino em volta acerta o resto
    for _, cy, cx, raio in sorted(palpites, reverse=True)[:8]:
        for escala in (1.0, 1.05, 0.95, 1.1, 0.9, 1.15):
            lado = int(raio / 0.39 * escala)
            if lado > min(h, w) or lado < 0.3 * min(h, w):
                continue
            y0 = int(max(0, min(h - lado, cy - lado / 2)))
            x0 = int(max(0, min(w - lado, cx - lado / 2)))
            recorte = tinta[y0 : y0 + lado, x0 : x0 + lado]
            leitura = ler_como_bagua(recorte)
            achou = sum(v is not None for v in leitura.values())
            if achou > sum(v is not None for v in melhor[1].values()):
                melhor = (recorte, leitura)
            if achou == 9:
                return melhor
    return melhor


def ler_como_linha(tinta: np.ndarray):
    """
    A fusão vertical junta as barras e revela as faixas; dentro de cada faixa, os glifos
    se separam sozinhos, porque toda linha inteira atravessa o glifo de ponta a ponta.

    Fechar o vão do yin na horizontal, como se fazia antes, colava glifos vizinhos: o vão
    entre dois deles é menor que o fechamento. A junção agora é pelo tamanho — o glifo é
    mais ou menos quadrado, então a altura da faixa diz quanto ele mede de largura, e só
    se juntam pedaços que ainda cabem nessa medida. É o caso do glifo todo partido, que
    não tem nenhuma linha inteira para segurá-lo unido.
    """
    # A margem temporária evita que o fechamento coma a primeira e a última barra: sem
    # ela, a erosão encolhe a tinta encostada na borda e a faixa sai curta, cortando o
    # glifo. É o que acontece quando já se recebe um recorte justo da fileira.
    folgado = np.pad(tinta, ((31, 31), (0, 0)))
    vertical = ndimage.binary_closing(folgado, structure=np.ones((31, 1)))[31:-31]

    # Num glifo grande — os que ocupam o quadro inteiro — as barras ficam tão espaçadas
    # que a fusão vertical não as alcança e cada uma vira uma faixa. Junta as faixas de
    # uma barra só até fecharem um glifo.
    faixas: list[tuple[int, int]] = []
    for y0, y1 in bandas(vertical.sum(axis=1), 2, 60):
        se_sozinha = len(barras_de(tinta[y0:y1])) == 1
        if faixas and se_sozinha and len(barras_de(tinta[faixas[-1][0] : faixas[-1][1]])) < 6:
            faixas[-1] = (faixas[-1][0], y1)
        else:
            faixas.append((y0, y1))

    fileiras = []
    for y0, y1 in faixas:
        faixa = tinta[y0:y1]
        altura = y1 - y0
        juntos: list[tuple[int, int]] = []
        for a, b in bandas(faixa.sum(axis=0), 0.5, 10):
            if juntos and b - juntos[-1][0] <= 1.35 * altura:
                juntos[-1] = (juntos[-1][0], b)
            else:
                juntos.append((a, b))
        fileiras.append([ler_hexagrama(faixa[:, a:b], (6, 3)) for a, b in juntos])
    return fileiras


def blocos_de(sequencia):
    saida = []
    for c in sequencia:
        aa = CODIGO[c]
        if not saida or saida[-1][0] != aa:
            saida.append((aa, [c]))
        else:
            saida[-1][1].append(c)
    return saida


def conferir(sequencia):
    problemas = []
    for aa, codons in blocos_de(sequencia):
        if len(set(codons)) != len(codons):
            problemas.append(f"{NOME[aa]} repete o mesmo códon dentro do bloco")
        if len(codons) != FAMILIA[aa]:
            problemas.append(f"{NOME[aa]} aparece com {len(codons)} de {FAMILIA[aa]} códons")
    return problemas


def main() -> int:
    titulos = {
        p["numero"]: p["titulo"]
        for p in json.loads((RAIZ / "src/dados/protocolos.json").read_text())
    }
    for numero in [int(a) for a in sys.argv[1:]] or [1]:
        tinta = carregar(numero)
        print(f"\n═══ {numero:02d} · {titulos.get(numero, '?')}")

        bagua = ler_como_bagua(tinta)
        if all(bagua.values()):
            print("  arranjo: bagua\n")
            for pos in ORDEM:
                c = codon(bagua[pos])
                marca = " (centro)" if pos == "C" else ""
                print(f"    {pos:3s} {bagua[pos]}  {c}  {NOME[CODIGO[c]]}{marca}")
            seq = [codon(bagua[p]) for p in HORARIO]
            problemas = conferir(seq)
            print("\n    sequência:", NOME[CODIGO[codon(bagua['C'])]], "(centro) → ",
                  " → ".join(NOME[aa] for aa, _ in blocos_de(seq)))
            print("    conferência:", "; ".join(problemas) if problemas else "sem problemas")
            print(f"\n    centro: '{codon(bagua['C'])}'")
            print("    anel:", [codon(bagua[p]) for p in ORDEM if p != "C"])
            continue

        fileiras = ler_como_linha(tinta)
        if fileiras and all(all(f) for f in fileiras):
            print(f"  arranjo: linha, {len(fileiras)} fileira(s)\n")
            plano = []
            for nf, fila in enumerate(fileiras, 1):
                codons = [codon(x) for x in fila]
                plano += codons
                print(f"    fileira {nf}: " + "  ".join(f"{c} ({NOME[CODIGO[c]]})" for c in codons))
            problemas = conferir(plano)
            print("\n    sequência:", " → ".join(NOME[aa] for aa, _ in blocos_de(plano)))
            print("    conferência:", "; ".join(problemas) if problemas else "sem problemas")
            print("\n    hexagramas:", [[codon(x) for x in f] for f in fileiras])
            continue

        faltam = [p for p, v in bagua.items() if not v]
        print(f"  não consegui ler — como bagua faltaram {len(faltam)} posições: {faltam}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
