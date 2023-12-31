import { cwd } from 'node:process'
import { writeFileSync } from 'node:fs'
import { relative, join } from 'pathe'
import { white, bgRed, green, bgYellow } from 'kolorist'
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
  getFormatCode,
} from './utils'
import type { StyleType } from './utils'
import minimist from 'minimist'
import { Parser } from './data'

const [userStyleCodePath] = minimist(process.argv.slice(2))._
const { isVue, isReact } = isInfo()

if (!isReact && !isVue) {
  console.warn(
    bgYellow(
      '👉 After judgment, if Vue or React is not installed in your project, an HTML file will be automatically created for you.'
    )
  )
}

async function run() {
  const userStyleCodePathReal = join(cwd(), userStyleCodePath)
  const userStyleFileName = userStyleCodePathReal.split('/').pop() || ''
  const userStyleType = getStyleFileType(userStyleFileName)
  const fileSuffix = getTheFileSuffix()
  if (fileSuffix === 'html' && userStyleType !== 'css') {
    throw `Generation failed! HTML files only support importing CSS files, but your file type is ${userStyleType}.`
  }
  const componentName = userStyleFileName.split('.')[0]
  const userStyleCodeDirPath = join(userStyleCodePathReal, '..')
  const styleCode = readFileCode(userStyleCodePathReal)
  const cssCode = await getCssCode(styleCode, userStyleType)
  const cssTree = getCssTree(cssCode)
  const selectorList = getSelectorListFromCssTree(cssTree)
  const domTree = getDomTree(selectorList)
  const domStr = getDomStr(domTree, ['tsx', 'jsx'].includes(fileSuffix) ? 'react' : (fileSuffix as 'vue' | 'html'))
  const code = await getTypeCode(
    domStr,
    userStyleType as StyleType,
    componentName,
    fileSuffix,
    './' + relative(userStyleCodeDirPath, userStyleCodePathReal)
  )
  writeFileSync(
    join(userStyleCodeDirPath, `${componentName}.${fileSuffix}`),
    await getFormatCode(code, { parser: Parser[fileSuffix] }),
    'utf-8'
  )
}

run()
  .then(() => {
    console.log(green(`🌈 sucess`))
  })
  .catch((err) => {
    console.error(bgRed(white(`🥹 ${err}`)))
  })
