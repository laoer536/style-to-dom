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

## Pay attention to the following points

For the case where the class is labeled at this level, you need to write it as follows

```less
.home {
  width: 100%;
  height: 100vh;
  text-align: center;
  .title {
    font-size: 18px;
    font-weight: bold;
    //&.active{
    //  color: red;
    //}
    &.self-active{  // Mark this level with 'self'
      color: red;
    }
    & > img {
      width: 32px;
      height: 32px;
      transition: transform 0.3s ease-in-out;
      &:hover {
        transform: scale(1.2);
      }
    }
    h2 {
      //&.sub-title {
      //  font-size: 14px;
      //  .sss {
      //    font-size: 57px;
      //  }
      //}
      &.self-sub-title {  // Mark this level with 'self'
        font-size: 14px;
        .sss {
          font-size: 57px;
        }
      }
    }
  }
  input[type='text'] {
    background-color: aqua;
  }
}
```

Additionally, since class selectors only generate 'div' tags, if you want to specify which tags to generate, please use tag selectors when writing style selectors.
