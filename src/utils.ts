import less from 'less'
import sass from 'sass'
import { readFileSync } from 'node:fs'
import * as csstree from 'css-tree'
import type { ParseOptions } from 'css-tree'
import type { AtrulePrelude } from 'css-tree'
import { AtrulePlain, AtrulePreludePlain, ClassSelector, TypeSelector } from 'css-tree'

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
  return cssArrHasAll
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
  console.dir(domTree)
  const classAttribute = domType === 'vue' ? 'class' : 'className'
  const getSelectorName = (selector: string) => {
    return domType === 'vue'
      ? selector.startsWith('.')
        ? selector.slice(1)
        : ''
      : selector.startsWith('.')
      ? `Style${selector}`
      : ''
  }
  let result = ''
  function createDomStr(selectorList: string[], lastObj: ReturnType<typeof getDomTree>, numberOfLevels: number) {
    console.log('lastObj', lastObj)
    if (selectorList.length === 0) {
      return
    }
    for (const selector of selectorList) {
      console.log(selector)
      const domName = selector.startsWith('.') ? 'div' : selector
      const selectorName = getSelectorName(selector)
      // if (result) {
      //   result = result.replace(
      //     '##',
      //     `<${domName} ${classAttribute}='${selectorName}'>${selectorName + numberOfLevels}##</${domName}>`
      //   )
      // } else {
      //   result = `<${domName} ${classAttribute}='${selectorName}'>${selectorName + numberOfLevels}##</${domName}>`
      // }
      result += `<${domName} ${classAttribute}='${selectorName}'>${selectorName + numberOfLevels}##</${domName}>`
      createDomStr(Object.keys(lastObj[selector]), lastObj[selector], numberOfLevels)
    }
  }
  createDomStr(Object.keys(domTree), domTree, 0)
  console.log(result)
  return result
}
