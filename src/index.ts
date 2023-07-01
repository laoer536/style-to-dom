import { cwd } from 'node:process'
import { join } from 'node:path'
import { readFileCode, getLessCssCode, getCssTree } from './utils'
async function run() {
  const lessCode = readFileCode(join(cwd(), './test/less/react/index.module.less'))
  console.log(lessCode)
  const cssCode = await getLessCssCode(lessCode)
  console.log(cssCode)
  console.log(getCssTree(cssCode))
}

run().then(() => {
  console.log('sucess')
})
