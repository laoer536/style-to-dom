import less from 'less'
import sass from 'sass'
import { readFileSync } from 'node:fs'
import * as csstree from 'css-tree'
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

export function getCssTree(cssCode: string) {
  return csstree.parse(cssCode)
}
