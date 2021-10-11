const path = require('path');
const jiti = require('jiti');

const defaultNxxtConfigFile = 'nxxt.config';

const cwd = process.cwd()

const getNxxtConfig = () => {
   return jiti(path.resolve(cwd))(`./${defaultNxxtConfigFile}.js`).default;
}

module.exports = {
   defaultNxxtConfigFile,
   getNxxtConfig
}