import { overrideEnv } from '../utils/env'
import { defineNuxtCommand } from './index'

export default defineNuxtCommand({
  meta: {
    name: 'build',
    usage: 'npx npxt build [--prerender] [rootDir]',
    description: 'Build npxt for production deployment'
  },
  async invoke (args) {
    overrideEnv('production');

    // // const rootDir = resolve(args._[0] || '.')

    // await build(clientOptions);
    // await build(serverOptions);
  }
})
