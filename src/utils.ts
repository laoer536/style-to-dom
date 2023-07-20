import less from 'less'
import { compileString } from 'sass'
import { readFileSync } from 'node:fs'
import * as csstree from 'css-tree'
import type { ParseOptions } from 'css-tree'
import type { AtrulePrelude } from 'css-tree'
import { AtrulePlain, AtrulePreludePlain, ClassSelector, TypeSelector } from 'css-tree'
import { getPackageInfo, isPackageExists } from 'local-pkg'
import { templates } from './templates'

export type StyleType = 'css' | 'less' | 'scss'

export function getStyleFileType(fileName: string) {
  const nameArr = fileName.split('.')
  const suffix = nameArr.pop()
  if (suffix && ['css', 'less', 'scss'].includes(suffix)) {
    return suffix as StyleType
  } else {
    throw `File type must be css,less,or scss.`
  }
}

export function getLessCssCode(lessCode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    less.render(lessCode, (error, output) => {
      if (error) {
        reject(error)
      } else {
        resolve(output?.css || '')
      }
    })
  })
}

export function getScssCssCode(scssCode: string) {
  return compileString(scssCode).css
}

export async function getCssCode(styleCode: string, styleType: StyleType) {
  if (styleType === 'less') {
    return await getLessCssCode(styleCode)
  } else if (styleType === 'scss') {
    return getScssCssCode(styleCode)
  } else {
    return styleCode
  }
}

export function readFileCode(filePath: string) {
  return readFileSync(filePath, 'utf-8')
}

export function getCssTree(cssCode: string, options?: ParseOptions) {
  return csstree.parse(cssCode, options) as AtrulePrelude
}

export function getSelectorListFromCssTree(cssTree: AtrulePrelude) {
  const cssArrHasAll: string[][] = []
  const info1Arr = cssTree.children.toArray() as AtrulePlain[]
  for (const info1 of info1Arr) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const info2Arr = (info1.prelude as AtrulePreludePlain).children.toArray() as AtrulePrelude[]
    for (const info2 of info2Arr) {
      const cssList = info2.children.toArray() as Array<ClassSelector | TypeSelector>
      cssArrHasAll.push(
        cssList
          .filter((info3) => ['ClassSelector', 'TypeSelector'].includes(info3.type))
          .map((info4) => (info4.type === 'ClassSelector' ? `.${info4.name}` : info4.name))
      )
    }
  }
  const allLineArr: string[][] = []
  for (const selectorArr of cssArrHasAll) {
    const singleLineArr: string[] = []
    let lastSelector = ''
    for (const selector of selectorArr) {
      if (lastSelector && selector.includes('self')) {
        singleLineArr.pop()
        singleLineArr.push(lastSelector + selector)
      } else {
        singleLineArr.push(selector)
      }
      lastSelector = selector
    }
    allLineArr.push(singleLineArr)
  }
  return allLineArr
}

export function getDomTree(selectorList: string[][]) {
  const result: Record<string, Record<string, string> | NonNullable<unknown>> = {}
  for (const oneWholeSelector of selectorList) {
    let local = result
    for (const selector of oneWholeSelector) {
      let temp = local[selector]
      temp ??= {}
      local[selector] = temp
      local = temp
    }
  }
  return result
}

export function getDomStr(domTree: ReturnType<typeof getDomTree>, domType: 'vue' | 'react') {
  const classAttribute = domType === 'vue' ? 'class' : 'className'
  const getSelectorName = (selector: string) => {
    return domType === 'vue'
      ? selector.startsWith('.')
        ? `"${selector.slice(1)}"`
        : ''
      : selector.startsWith('.')
      ? `{Style['${selector.slice(1)}']}`
      : ''
  }
  const getDomName = (selector: string) => {
    if (selector.startsWith('.')) {
      return 'div'
    } else {
      if (selector.includes('.self')) {
        return selector.split('.self')[0]
      } else {
        return selector
      }
    }
  }
  function create(domTree: ReturnType<typeof getDomTree>, selector: string) {
    const keys = Object.keys(domTree)
    const domName = getDomName(selector)
    const selectorName = getSelectorName(selector.includes('.self') ? '.' + selector.split('.')[1] : selector)
    if (keys.length === 0) {
      return `<${domName} ${classAttribute}=${selectorName || `'${domName}'`}></${domName}>`
    } else {
      let result = `<${domName} ${classAttribute}=${selectorName || `'${domName}'`}>`
      for (const selector of keys) {
        result += create(domTree[selector], `${selector}`)
      }
      result += `</${domName}>`
      return result
    }
  }
  return create(domTree, '.root')
}

export function isInfo() {
  const isTs = isPackageExists('typescript')
  const isVue = isPackageExists('vue')
  const isReact = isPackageExists('react')
  return { isTs, isReact, isVue }
}

export function getTheFileSuffix() {
  const { isVue, isReact, isTs } = isInfo()
  if (isVue) {
    return 'vue'
  } else if (isReact) {
    if (isTs) {
      return 'tsx'
    } else {
      return 'jsx'
    }
  } else {
    throw 'Currently only VUE and React are supported.'
  }
}

export async function getTypeCode(
  domStr: string,
  styleType: StyleType,
  componentName: string,
  fileSuffix: ReturnType<typeof getTheFileSuffix>,
  stylePath: string
) {
  const codeAfterInjectingKeyInformation = (templateCode: string) =>
    templateCode
      .replace('{componentName}', componentName)
      .replace('{domStr}', domStr)
      .replace('{stylePath}', stylePath)
      .replace('{styleType}', styleType)

  const { isTs } = isInfo()
  if (fileSuffix === 'vue') {
    const result = await getPackageInfo('vue')
    if (!result) throw 'vue not install.'
    const vueVersion = result.version.startsWith('2.') ? 'vue2' : 'vue3'
    if (isTs) {
      return codeAfterInjectingKeyInformation(templates['vue3TsCode'])
    } else {
      return codeAfterInjectingKeyInformation(templates[vueVersion === 'vue3' ? 'vue3JsCode' : 'vue2JsCode'])
    }
  } else if (['jsx', 'tsx'].includes(fileSuffix)) {
    return codeAfterInjectingKeyInformation(templates['reactCode'])
  } else {
    throw 'Currently only VUE and React are supported.'
  }
}
