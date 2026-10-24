# Onde é isso?

Jogo multiplayer pra jogar no celular: aparece uma foto do Brasil e cada um chuta
em que cidade (ou região) ela foi tirada.

Roda em dois lugares, com o mesmo código:

- **No site** (`/onde-e-isso`, Netlify): a sala é a função `netlify/functions/onde-e-isso.mjs`,
  que guarda a presença de cada jogador no Netlify Blobs; o navegador faz polling a cada ~0,5s.
  Não precisa de login.
- **Como Claude Artifact**: usa a capacidade `room` do Artifact.

- Quem aperta "Começar partida" comanda o jogo: o estado fica na memória desse
  celular e é transmitido pela presença do room. Deixe essa tela ligada.
- Pontos: 500 a 1000 pela rapidez × dificuldade, bônus por sequência, por ser o
  único a acertar, e a última rodada vale em dobro.
- Modo mesa: um celular só, a galera grita e alguém marca quem acertou.

## Estrutura

- `data/places.mjs`: lista de lugares (cidade, UF, fato, artigo da Wikipédia ou
  arquivo do Commons).
- `scripts/build-places.mjs`: resolve as fotos no Wikimedia Commons e gera `data/places.json`.
- `scripts/download-images.py`: baixa as fotos (960px) pra `../public/onde-e-isso/img/`.
- `scripts/build.mjs`: embute os dados em `src/index.html` e gera `../public/onde-e-isso/index.html`
  (site) e `dist/index.html` (artifact).

```sh
node scripts/build-places.mjs
python3 scripts/download-images.py
node scripts/build.mjs
```

Faça commit de `public/onde-e-isso/` e o deploy da Netlify publica. Para o artifact,
publique `dist/index.html` com os arquivos `img/*.jpg` e a capacidade `room`.

Fotos: Wikimedia Commons, com autor e licença mostrados na revelação de cada rodada.
