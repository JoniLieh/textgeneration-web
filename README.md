# Projektaufgabe 2 – NLP „Textgenerierung“

Entwickeln Sie ein Programm in der Programmiersprache Ihrer Wahl, das gültige Zeichenketten der
durch eine kontextfreie Grammatik definierten Sprache generieren kann. Eine konkrete Grammatik
soll in Form einer Textdatei übergeben werden und änderbar sein. Lassen Sie durch Ihr Programm
gültige Zeichenketten vom Startsymbol oder durch Vorgabe eines Nichtterminal‐Symbols generieren.
Alternativ kann auch ein Terminal‐Symbol vorgelegt werden, das in der generierten gültigen
Zeichenkette vom Startsymbol der Grammatik enthalten sein muss. Zusätzlich soll Ihr Programm
auch das Generieren mehrerer Sätze und das Vorhandensein von folgenden abkürzenden Notationen
in der Grammatik unterstützen:

* `|` …für Alternativen auf der rechten Seite einer Produktionsregel
* `[…]*` …für 0 bis n Wiederholungen auf der rechten Seite einer Produktionsregel
* `[…]+` …für 1 bis n Wiederholungen auf der rechten Seite der Produktionsregel
* `[…]?` …für optionale Elemente auf der rechten Seite einer Produktionsregel

Entwerfen Sie als Testfälle für Ihre Erweiterung eine Grammatik für Fragen oder für Aufforderungen
(vgl. http://www.canoo.net/services/OnlineGrammar/Satz/Satzart/index.html?MenuId=Sentence10)
in deutscher Sprache. Verwenden Sie dabei Produktionsregeln mit abkürzender Notation und zeigen
Sie, dass Ihr Programm gültige Zeichenketten vom Startsymbol oder durch Vorgabe eines
Nichtterminal‐Symbols mit den erweiterten Produktionsregeln generieren kann. Alternativ kann auch
ein Terminal‐Symbol vorgelegt werden, das in der generierten gültigen Zeichenkette vom
Startsymbol der Grammatik enthalten sein muss.

![previewImage](https://i.imgur.com/3O7p7Nw.png)

```sh
bun install
# Development
bun run dev
# Production
bun run build
bun run start
```

# Nuxt 3

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
