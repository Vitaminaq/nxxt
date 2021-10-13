import path from 'path';
import fs from 'fs';
import jiti from 'jiti';

export const defaultNxxtConfigFile = 'nxxt.config';

const cwd = process.cwd()

const fileTypes = ['js', 'ts', 'mjs'];

export const getNxxtConfig = () => {
   const configFileTypes = fileTypes.filter((t) => {
      return fs.existsSync(path.resolve(cwd, `${defaultNxxtConfigFile}.${t}`));
   });
   if (!configFileTypes) return null;
   return jiti(path.resolve(cwd))(`./${defaultNxxtConfigFile}`).default;
}
