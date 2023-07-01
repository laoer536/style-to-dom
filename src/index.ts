import { cwd } from 'node:process'
import { join } from 'node:path'
import { readFileCode, getLessCssCode } from './utils'
async function run() {
  const lessCode = readFileCode(join(cwd(), './test/less/react/index.module.less'))
  console.log(lessCode)
  console.log(await getLessCssCode(lessCode))
}

run().then(() => {
  console.log('sucess')
})
