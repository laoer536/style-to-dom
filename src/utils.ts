import less from 'less'
import sass from 'sass'
import { readFileSync } from 'node:fs'
import * as csstree from 'css-tree'
import type { ParseOptions } from 'css-tree'
import type { AtrulePrelude } from 'css-tree'
import { AtrulePlain, AtrulePreludePlain, ClassSelector, string, TypeSelector } from 'css-tree'

export function getStyleFileType(fileName: string) {
  const nameArr = fileName.split('.')
  const suffix = nameArr.pop()
  if (suffix && ['css', 'less', 'scss'].includes(suffix)) {
    return suffix
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
  return sass.compileString(scssCode)
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
  console.log('allLineArr', allLineArr)
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

export function getDomStr(domTree: ReturnType<typeof getDomTree>, domType: 'vue' | 'react' = 'react') {
  const classAttribute = domType === 'vue' ? 'class' : 'className'
  const getSelectorName = (selector: string) => {
    return domType === 'vue'
      ? selector.startsWith('.')
        ? selector.slice(1)
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
      return `<${domName} ${classAttribute}=${selectorName || `'${domName}'`}>##</${domName}>`
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
