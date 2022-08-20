import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    inlineDependencies: true
  },
  entries: [
    'src/cli',
    'src/index'
  ],
  externals: [
    '@npxt/vite-builder',
    // TODO: Fix rollup/unbuild issue
    'node:url',
    'node:buffer',
    'node:path',
    'node:child_process',
    'node:process',
    'node:path',
    'node:os'
  ]
})
