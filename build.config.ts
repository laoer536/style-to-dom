import { defineBuildConfig } from 'unbuild'
export default defineBuildConfig({
  failOnWarn: false,
  rollup: {
    esbuild: {
      minify: true,
    },
  },
})
