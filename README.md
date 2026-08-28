# app-htg

Consulta rápida dos 101 protocolos do livro **HTG — Hexagrama Terapia Genética: 101
Tratamentos**, de Marisa Ferreira da Silva. Busca por sintoma digitado ou por palavras-chave.

Aplicação web em React que vira app de celular (iOS e Android) via Capacitor, com o mesmo código.

## Como rodar

O Node fica em `~/.local/node`. Se o comando `npm` não for encontrado, abra um terminal novo
(o PATH foi adicionado ao `~/.zshrc`).

```bash
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão de produção em dist/
npm run lint     # verifica o código
```

Para testar no celular, conecte o telefone no mesmo Wi-Fi e abra o endereço "Network" que aparece
no terminal ao rodar `npm run dev`.

## Telas

| Rota | O que faz |
| --- | --- |
| `/` | Busca por texto livre e por chips de palavras-chave |
| `/indice` | Os 101 protocolos em ordem alfabética |
| `/protocolo/:numero` | Desenho do protocolo, onde aplicar, palavras-chave e relações energéticas |
| `/sobre` | Como usar, dúvidas frequentes e aviso de saúde |

## Como a busca funciona

Em [src/lib/busca.ts](src/lib/busca.ts):

1. **Normaliza** a consulta — minúsculas, sem acento e sem pontuação. "Insônia" acha "insonia".
2. **Descarta palavras vazias** ("estou com muita dor nas costas" vira `costas`).
3. **Expande sinônimos** ([src/lib/sinonimos.ts](src/lib/sinonimos.ts)) — "não consigo dormir"
   alcança *Insônia*; "quero emagrecer" alcança *Obesidade*. O mapa tolera gênero e plural, então
   "nervosa" encontra "nervoso". Os sinônimos só apontam para termos que já existem no livro.
4. **Pontua** cada protocolo: título vale mais que palavra-chave, que vale mais que o texto
   secundário. Erros de digitação de uma letra ainda pontuam ("anciedade" acha *Ansiedade*).
5. **Ordena** por quantos termos o protocolo atendeu e depois pela pontuação.

Os chips de palavra-chave entram na busca como termos adicionais, somando com o que foi digitado.

## De onde vêm os dados

[src/dados/protocolos.json](src/dados/protocolos.json) e as imagens em
[imagens-do-livro/](imagens-do-livro/) foram extraídos do PDF do livro por um script que:

- localiza a moldura de DNA em cada página (é a mesma imagem nas 101 páginas) e recorta
  exatamente aquela região a 3× de resolução, em tons de cinza e WebP sem perdas;
- lê título, relações energéticas, palavras-chave, sugestões e a nota de onde desenhar a partir
  da posição dos blocos de texto na página.

Para regerar (o PDF precisa estar no caminho indicado no script):
`python3 scripts/extrair_protocolos.py`

## Virar aplicativo de celular

```bash
npm run app:ios          # cria a pasta ios/ (precisa de Xcode)
npm run app:android      # cria a pasta android/ (precisa de Android Studio)
npm run app:sync         # build + envia o código atualizado para os projetos nativos
npm run app:abrir-ios    # abre no Xcode
```

Antes de publicar, trocar o `appId` em [capacitor.config.ts](capacitor.config.ts) — o valor atual
(`com.exemplo.apphtg`) é provisório e o identificador é permanente nas lojas.

## Aviso

O app exibe, em todas as telas de resultado e de protocolo, que o HTG não substitui diagnóstico
nem tratamento médico. Isso é requisito das lojas para aplicativos de saúde e não deve ser
removido.
