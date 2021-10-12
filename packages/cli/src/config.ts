import path from 'path';
import jiti from 'jiti';

export const defaultNxxtConfigFile = 'nxxt.config';

const cwd = process.cwd()

export const getNxxtConfig = () => {
   return jiti(path.resolve(cwd))(`./${defaultNxxtConfigFile}`).default;
}
