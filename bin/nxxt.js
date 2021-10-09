#!/usr/bin/env node

// const requiredVersion = require('../package.json').engines.node
const program =  require('commander');

// 检测node版本
// function checkNodeVersion (wanted, id) {
//     if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
//       console.log(chalk.red(
//         'You are using Node ' + process.version + ', but this version of ' + id +
//         ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
//       ))
//       process.exit(1)
//     }
// }
  
// checkNodeVersion(requiredVersion, 'nxxt')

program
  .version(`nxxt ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create a new project powered by nxxt')
  .option('-d, --debug', 'output extra debugging')
  .action((name, options) => {
      console.log(name, options)
    // if (minimist(process.argv.slice(3))._.length > 1) {
    //   console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    // }
    // // --git makes commander to default git to true
    // if (process.argv.includes('-g') || process.argv.includes('--git')) {
    //   options.forceGit = true
    // }
    // require('../lib/create')(name, options)
  });

program.parse(process.argv);
