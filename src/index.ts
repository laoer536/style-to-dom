import { cwd } from 'node:process'
import { join } from 'node:path'
import { readFileCode, getLessCssCode, getDomTree, getCssTree, getSelectorListFromCssTree } from './utils'

async function run() {
  const lessCode = readFileCode(join(cwd(), './test/less/react/index.module.less'))
  const cssCode = await getLessCssCode(lessCode)
  const cssTree = getCssTree(cssCode)
  const selectorList = getSelectorListFromCssTree(cssTree)
  getDomTree(selectorList)
}

run().then(() => {
  console.log('sucess')
})
