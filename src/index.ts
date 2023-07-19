import { cwd } from 'node:process'
import { writeFileSync } from 'node:fs'
import { join } from 'pathe'
import {
  readFileCode,
  getLessCssCode,
  getDomTree,
  getCssTree,
  getSelectorListFromCssTree,
  getDomStr,
  isInfo,
  getTheFileSuffix,
} from './utils'
import minimist from 'minimist'

const [userStyleCodePath] = minimist(process.argv.slice(2))._
const { isVue, isReact } = isInfo()

if (!isReact && !isVue) {
  throw 'Currently only VUE and React are supported.'
}

async function run() {
  const userStyleCodePathReal = join(cwd(), userStyleCodePath)
  const userStyleCodeDirPath = join(userStyleCodePathReal, '..')
  const userStyleFileName = userStyleCodePathReal.split('/').pop() || ''
  const lessCode = readFileCode(userStyleCodePathReal)
  const cssCode = await getLessCssCode(lessCode)
  const cssTree = getCssTree(cssCode)
  const selectorList = getSelectorListFromCssTree(cssTree)
  const domTree = getDomTree(selectorList)
  const domStr = getDomStr(domTree)
  writeFileSync(join(userStyleCodeDirPath, `${userStyleFileName.split('.')[0]}.${getTheFileSuffix()}`), domStr, 'utf-8')
}

run().then(() => {
  console.log('sucess')
})
