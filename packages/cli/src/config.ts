import path from 'path';
import fs from 'fs';
import jiti from 'jiti';
import { InlineConfig } from 'vite';

export const defaultNxxtConfigFile = 'nxxt.config';

const cwd = process.cwd()

const fileTypes = ['js', 'ts', 'mjs'];

export interface NxxtConfig {
   mode?: string;

}

export const getNxxtConfig = (): NxxtConfig => {
   const configFileTypes = fileTypes.filter((t) => {
      return fs.existsSync(path.resolve(cwd, `${defaultNxxtConfigFile}.${t}`));
   });
   if (!configFileTypes) return null;
   return jiti(path.resolve(cwd))(`./${defaultNxxtConfigFile}`).default;
}

export const mergeConfig = (inlineConfig: InlineConfig) => {
   const nxxtConfig = getNxxtConfig();
   
   const mode = inlineConfig.mode || nxxtConfig.mode || 'production'

   process.env.NODE_ENV = mode;

   return {
      ...inlineConfig,
      ...nxxtConfig,
      mode,
   }
}
