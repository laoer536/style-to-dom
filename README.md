# style-to-dom
Fast create dom file by less or scss or css file.

## Install

npm

```js
npm install style-to-dom -D
```

pnpm

```js
pnpm add style-to-dom -D
```

yarn

```js
yarn add style-to-dom -D
```

## Use

Execute the following command in the project root directory

```js
create-style-dom <yourStyleFilePath>
```

Such as './src/pages/list/card/style/index.module.less'

`<yourStyleFilePath>` is relative to the root directory of your project.

Then will create dom file for this style file. This file may be Vue, tsx, jsx, or HTML, depending on what framework your project uses and whether your project has typescript. If your project does not use React or Vue, an HTML file will be generated for you.
