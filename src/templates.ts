const vue2JsCode = `<template>
  {domStr}
</template>

<script>
export default {
  name:{componentName}
  data(){
     return{
          
    }
  }
};
</script>

<style lang="{styleType}" scoped>
"@import '{stylePath}'"
</style>
`

const vue3JsCode = `<template>
   {domStr}
</template>

<script setup>

</script>

<style scoped lang="{styleType}">
"@import '{stylePath}'"
</style>`

const vue3TsCode = `<template>
   {domStr}
</template>

<script setup lang="ts">

</script>

<style scoped lang="{styleType}">
"@import '{stylePath}'"
</style>`

const reactCode = `
import React from 'react'
import Style from '{stylePath}'
export default function {componentName}() {
  return  {domStr}
}
`

export const templates = { vue2JsCode, vue3TsCode, vue3JsCode, reactCode }
