# style-to-dom
Fast create dom file by less or scss or css file.

## sponsor
[<img src="https://api.gitsponsors.com/api/badge/img?id=660767296" height="30">](https://api.gitsponsors.com/api/badge/link?p=VrVlCjVTScheaCH16aely0PqDuEtfR2/tmMl+MwvIx9OF6R7SVtVbtdf8vMuc+haGiWP2ZJV2H11AVJv8BKlCDeUOQic7hsDoEzXLjNRI8VaLWcOHeR3uY/1X79ds7WYD33VH0YUXw52HopkpNL41g==)

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

If in `vue3-ts` project, will create a `vue` file

```vue
<template>
  <div class="root">
    <div class="home">
      <div class="title">
        <img class="img" />
        <h2 class="self-sub-title"><div class="sss"></div></h2>
      </div>
      <div class="title"></div>
      <input class="input" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  @import './index.scss';
</style>
```

If in `react-ts` project, will create a `tsx` file

```tsx
import React from "react";
import Style from "./index.module.scss";
export default function index() {
  return (
    <div className={Style["root"]}>
      <div className={Style["home"]}>
        <div className={Style["title"]}>
          <img className="img" />
          <h2 className={Style["self-sub-title"]}>
            <div className={Style["sss"]}></div>
          </h2>
        </div>
        <div className={Style["title"]}></div>
        <input className="input" />
      </div>
    </div>
  );
}
```

> react-js | vue2-js | vue3-js are also supported, so I won't give an example here.

Additionally, since class selectors only generate 'div' tags, if you want to specify which tags to generate, please use tag selectors when writing style selectors.
