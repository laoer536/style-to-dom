import { cwd } from 'node:process'
import { writeFileSync } from 'node:fs'
import { relative, join } from 'pathe'
import {
  readFileCode,
  getDomTree,
  getCssTree,
  getSelectorListFromCssTree,
  getDomStr,
  isInfo,
  getTheFileSuffix,
  getTypeCode,
  getStyleFileType,
  getCssCode,
} from './utils'
import type { StyleType } from './utils'
import minimist from 'minimist'

const [userStyleCodePath] = minimist(process.argv.slice(2))._
const { isVue, isReact } = isInfo()

if (!isReact && !isVue) {
  throw 'Currently only VUE and React are supported.'
}

async function run() {
  const userStyleCodePathReal = join(cwd(), userStyleCodePath)
  const userStyleFileName = userStyleCodePathReal.split('/').pop() || ''
  const userStyleType = getStyleFileType(userStyleFileName)
  const componentName = userStyleFileName.split('.')[0]
  const userStyleCodeDirPath = join(userStyleCodePathReal, '..')
  const styleCode = readFileCode(userStyleCodePathReal)
  const cssCode = await getCssCode(styleCode, userStyleType)
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
