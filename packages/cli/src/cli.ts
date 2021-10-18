import { cac } from 'cac'
import { build } from 'vite';
import { getNxxtConfig } from './config';
import { getBaseBuildConfig } from './build/index';
import { server } from './server';

const cli = cac('nxxt');

// dev
cli
  .command('[root]') // default command
  .alias('serve')
  .action(() => {
    // 获取构建参数
    const { clientOptions, serverOptions } = getBaseBuildConfig(getNxxtConfig());
    server(clientOptions)
  })

// build
cli
  .command('build [root]')
  .action(() => {
    // 获取构建参数
    const { clientOptions, serverOptions } = getBaseBuildConfig(getNxxtConfig());

    // 服务端渲染构建
    build(clientOptions).then(() => {
      build(serverOptions)
    });
  })

cli.help()
cli.version(require('../package.json').version)
  
cli.parse()
