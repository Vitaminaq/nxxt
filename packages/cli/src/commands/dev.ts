// import { resolve, relative, normalize } from 'pathe'
// import { debounce } from 'perfect-debounce'
// import chokidar from 'chokidar'
// import consola from 'consola';
import { overrideEnv, overrideRunType } from '../utils/env';
// import { showBanner } from '../utils/utils';
// import { buildClient } from '@npxt/vite-builder';
// import { loadNpxtConfig } from '../utils/config';
// import { Server } from '../ssr/server';
import { defineNuxtCommand } from './index'

export default defineNuxtCommand({
    meta: {
        name: 'dev',
        usage: 'npxt dev [rootDir] [--clipboard] [--open, -o] [--port, -p] [--host, -h] [--https] [--ssl-cert] [--ssl-key]',
        description: 'Run npxt development server'
    },
    async invoke(args) {
        overrideEnv('development');
        overrideRunType('devServer');

        // const ctx = loadNpxtConfig();

        // const rootDir = resolve(args._[0] || '.')

        // const devServer = await buildClient(ctx);

        // ctx.devServer = devServer;

        // new Server(ctx);

        console.log('jjjjjjjjjjjjjjjjjjjjjjjjj');

    // const rootDir = resolve(root || '.');

    // let loadingMessage = 'Npxt is starting...'

    // const load = async (isRestart: boolean, reason?: string) => {
    //     try {
    //       loadingMessage = `${reason ? reason + '. ' : ''}${isRestart ? 'Restarting' : 'Starting'} npxt...`
    //     //   currentHandler = null
    //       if (isRestart) {
    //         // consola.info(loadingMessage)
    //       }
    //     //   if (currentNuxt) {
    //     //     await currentNuxt.close()
    //     //   }
    //     //   currentNuxt = await loadNuxt({ rootDir, dev: true, ready: false })
    //     //   await currentNuxt.ready()
    //     //   await currentNuxt.hooks.callHook('listen', listener.server, listener)
    //     //   await Promise.all([
    //     //     writeTypes(currentNuxt).catch(console.error),
    //     //     buildNuxt(currentNuxt)
    //     //   ])
    //     //   currentHandler = currentNuxt.server.app
    //     //   if (isRestart && args.clear !== false) {
    //         // showBanner()
    //         // listener.showURL()
    //     //   }
    //     } catch (err) {
    //     //   consola.error(`Cannot ${isRestart ? 'restart' : 'start'} nuxt: `, err)
    //     //   currentHandler = null
    //       loadingMessage = 'Error while loading nuxt. Please check console and fix errors.'
    //     }
    // }

    // const dLoad = debounce(load)

    // const watcher = chokidar.watch([rootDir], { ignoreInitial: true, depth: 1 });

    // 监听非vite监听文件夹
    // watcher.on('all', (event, _file) => {
    //   if (!currentNuxt) { return }
    //   const file = normalize(_file)
    //   const buildDir = withTrailingSlash(normalize(currentNuxt.options.buildDir))
    //   if (file.startsWith(buildDir)) { return }
    //   const relativePath = relative(rootDir, file)
    //   if (file.match(/(nuxt\.config\.(js|ts|mjs|cjs)|\.nuxtignore|\.env|\.nuxtrc)$/)) {
    //     dLoad(true, `${relativePath} updated`)
    //   }

    //   const isDirChange = ['addDir', 'unlinkDir'].includes(event)
    //   const isFileChange = ['add', 'unlink'].includes(event)
    //   const reloadDirs = [currentNuxt.options.dir.pages, 'middleware']
    //     .map(d => resolve(currentNuxt.options.srcDir, d))

    //   if (isDirChange) {
    //     if (reloadDirs.includes(file)) {
    //       dLoad(true, `Directory \`${relativePath}/\` ${event === 'addDir' ? 'created' : 'removed'}`)
    //     }
    //   } else if (isFileChange) {
    //     if (file.match(/(app|error)\.(js|ts|mjs|jsx|tsx|vue)$/)) {
    //       dLoad(true, `\`${relativePath}\` ${event === 'add' ? 'created' : 'removed'}`)
    //     }
    //   }
    // })

    // await load(false)

    return 'wait' as const
    },
})
