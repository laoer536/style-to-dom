import { cwd } from 'node:process'
import { writeFileSync } from 'node:fs'
import { relative, join } from 'pathe'
import {
  readFileCode,
  getLessCssCode,
  getDomTree,
  getCssTree,
  getSelectorListFromCssTree,
  getDomStr,
  isInfo,
  getTheFileSuffix,
  getTypeCode,
  StyleType,
} from './utils'
import minimist from 'minimist'

const [userStyleCodePath] = minimist(process.argv.slice(2))._
const { isVue, isReact } = isInfo()

if (!isReact && !isVue) {
  throw 'Currently only VUE and React are supported.'
}

async function run() {
  const userStyleCodePathReal = join(cwd(), userStyleCodePath)
  const userStyleFileName = userStyleCodePathReal.split('/').pop() || ''
  const userStyleType = userStyleFileName.split('.').pop() || ''
  if (!['less', 'css', 'scss'].includes(userStyleType))
    throw 'For the time being, only less, scss, css files are supported'
  const componentName = userStyleFileName.split('.')[0]
  const userStyleCodeDirPath = join(userStyleCodePathReal, '..')
  const lessCode = readFileCode(userStyleCodePathReal)
  const cssCode = await getLessCssCode(lessCode)
  const cssTree = getCssTree(cssCode)
  const selectorList = getSelectorListFromCssTree(cssTree)
  const domTree = getDomTree(selectorList)
  const fileSuffix = getTheFileSuffix()
  const domStr = getDomStr(domTree, fileSuffix === 'vue' ? 'vue' : 'react')
  const code = await getTypeCode(
    domStr,
    userStyleType as StyleType,
    componentName,
    fileSuffix,
    './' + relative(userStyleCodeDirPath, userStyleCodePathReal)
  )
  writeFileSync(join(userStyleCodeDirPath, `${componentName}.${fileSuffix}`), code, 'utf-8')
}

run().then(() => {
  console.log('sucess')
})
