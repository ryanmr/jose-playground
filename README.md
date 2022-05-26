# swc-express-template

This is an express api template [powered by swc](https://swc.rs/). Modern JavaScript syntax, fast TypeScript compilation, no hocus pocus.

## Tech

* [swc](https://swc.rs/)
* [express](https://expressjs.com/)
* [typescript](https://www.typescriptlang.org/)

## Template

You can clone this repository and use the repository like a template.

```
git clone git@github.com:ryanmr/swc-express-template.git
```

You can also use `degit`:

```
npx degit github:ryanmr/swc-express-template
```

## Usage

### Setup

```
yarn install
```

### Develop

```
yarn dev
```

This uses [nodemon](https://www.npmjs.com/package/nodemon) and [npm-run-all](https://www.npmjs.com/package/npm-run-all) to compile and run in series whenever a `./src` file changes.

### Start

```
yarn start
```

```
node ./dist/index.js
```

### Updates

Considering checking for updated dependencies from time to time.

```
npx npm-check-updates
```
