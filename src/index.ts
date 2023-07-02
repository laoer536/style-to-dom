import { cwd } from 'node:process'
import { join } from 'node:path'
import { readFileCode, getLessCssCode, getNeededInfoFromCssTree } from './utils'
async function run() {
  const lessCode = readFileCode(join(cwd(), './test/less/react/index.module.less'))
  const cssCode = await getLessCssCode(lessCode)
  console.log(cssCode)
  console.log(getNeededInfoFromCssTree(cssCode))
}

run().then(() => {
  console.log('sucess')
})
