const vue2JsCode = `<template>
  {domStr}
</template>

<script>
export default {
  name:'{componentName}',
  data(){
     return{
          
    }
  }
};
</script>

<style lang="{styleType}" scoped>
@import '{stylePath}'
</style>
`

const vue3JsCode = `<template>
   {domStr}
</template>

<script setup>

</script>

<style scoped lang="{styleType}">
@import '{stylePath}'
</style>`

const vue3TsCode = `<template>
   {domStr}
</template>

<script setup lang="ts">

</script>

<style scoped lang="{styleType}">
@import '{stylePath}'
</style>`

const reactCode = `
import React from 'react'
import Style from '{stylePath}'
export default function {componentName}() {
  return  {domStr}
}
`

const htmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="{stylePath}"/>
    <title>{componentName}</title>
  </head>
  <body>
  {domStr}
</body>
</html>
`

export const templates = { vue2JsCode, vue3TsCode, vue3JsCode, reactCode, htmlCode }
