# Onde é isso?

Jogo multiplayer pra jogar no celular: aparece uma foto do Brasil e cada um chuta
em que cidade (ou região) ela foi tirada. Roda como um Claude Artifact, usando a
capacidade `room` pra sincronizar todo mundo que está com a página aberta.

- Quem aperta "Começar partida" comanda o jogo: o estado fica na memória desse
  celular e é transmitido pela presença do room. Deixe essa tela ligada.
- Pontos: 500 a 1000 pela rapidez × dificuldade, bônus por sequência, por ser o
  único a acertar, e a última rodada vale em dobro.
- Modo mesa: um celular só, a galera grita e alguém marca quem acertou.

## Estrutura

- `data/places.mjs`: lista de lugares (cidade, UF, fato, artigo da Wikipédia ou
  arquivo do Commons).
- `scripts/build-places.mjs`: resolve as fotos no Wikimedia Commons e gera `data/places.json`.
- `scripts/download-images.py`: baixa as fotos (960px) pra `public/img/`.
- `scripts/build.mjs`: embute os dados em `src/index.html` e gera `dist/index.html`.

```sh
node scripts/build-places.mjs
python3 scripts/download-images.py
node scripts/build.mjs
```

Depois, publique `dist/index.html` como Artifact com os arquivos `img/*.jpg` e a
capacidade `room`.

Fotos: Wikimedia Commons, com autor e licença mostrados na revelação de cada rodada.
