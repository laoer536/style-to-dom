import { cwd } from 'node:process'
import { join } from 'node:path'
import { readFileCode, getLessCssCode, getDomTree, getCssTree, getSelectorListFromCssTree, getDomStr } from './utils'

async function run() {
  const lessCode = readFileCode(join(cwd(), './test/less/react/index.module.less'))
  const cssCode = await getLessCssCode(lessCode)
  const cssTree = getCssTree(cssCode)
  const selectorList = getSelectorListFromCssTree(cssTree)
  const domTree = getDomTree(selectorList)
  getDomStr(domTree)
}

run().then(() => {
  console.log('sucess')
})
