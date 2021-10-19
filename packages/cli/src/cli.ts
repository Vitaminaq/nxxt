import { cac } from 'cac'
import { build, LogLevel, ServerOptions, BuildOptions } from 'vite';
import { mergeConfig } from './config';
import { getBaseBuildConfig, getClientOptions } from './build/index';
import { SSR } from './ssr/ssr';

const cli = cac('nxxt');

interface GlobalCLIOptions {
  '--'?: string[]
  c?: boolean | string
  config?: string
  r?: string
  root?: string
  base?: string
  l?: LogLevel
  logLevel?: LogLevel
  clearScreen?: boolean
  d?: boolean | string
  debug?: boolean | string
  f?: string
  filter?: string
  m?: string
  mode?: string
}

// function cleanOptions<Options extends GlobalCLIOptions>(
//   options: Options
// ): Omit<Options, keyof GlobalCLIOptions> {
//   const ret = { ...options }
//   delete ret['--']
//   delete ret.c
//   delete ret.config
//   delete ret.r
//   delete ret.root
//   delete ret.base
//   delete ret.l
//   delete ret.logLevel
//   delete ret.clearScreen
//   delete ret.d
//   delete ret.debug
//   delete ret.f
//   delete ret.filter
//   delete ret.m
//   delete ret.mode
//   return ret
// }

cli
  .option('-m, --mode <mode>', `[string] set env mode`)

// dev
cli
  .command('[root]') // default command
  .alias('serve')
  .action((root: string, options: ServerOptions & GlobalCLIOptions) => {
    const config = mergeConfig({
      root,
      ...options
    });
    // 获取构建参数
    const clientOptions = getClientOptions(config);
    new SSR({
      buildOptions: clientOptions
    })
  })

// build
cli
  .command('build [root]')
  .action((root: string, options: BuildOptions & GlobalCLIOptions) => {
    const config = mergeConfig({
      root,
      ...options
    });

    const { clientOptions, serverOptions } = getBaseBuildConfig(config);

    build(clientOptions);
    build(serverOptions);
  })

// start
cli
  .command('start [root]')
  .action((root: string, options: ServerOptions & GlobalCLIOptions) => {
    const config = mergeConfig({
      root,
      ...options
    });
    // 获取构建参数
    const clientOptions = getClientOptions(config);
    new SSR({
      buildOptions: clientOptions,
      runType: 'build'
    })
  })

cli.help()
cli.version(require('../package.json').version)
  
cli.parse()
