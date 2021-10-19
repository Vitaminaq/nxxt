import path from 'path';
import fs from 'fs';
import jiti from 'jiti';
import { InlineConfig } from 'vite';
import { getTypeFile } from './utils';

export const defaultNxxtConfigFile = 'nxxt.config';

const cwd = process.cwd()

const fileTypes = ['js', 'ts'];

export interface NxxtConfig {
   mode?: string;
   serverEntry?: string;
}

export const getNxxtConfig = (): NxxtConfig => {
   if (!getTypeFile(defaultNxxtConfigFile)) return {};
   return jiti(path.resolve(cwd))(`./${defaultNxxtConfigFile}`).default;
}

export const getServerEntry = () => {
   return getTypeFile('src/entry-server');
}

export const mergeConfig = (inlineConfig: InlineConfig) => {
   const nxxtConfig = getNxxtConfig();
   
   const mode = inlineConfig.mode || nxxtConfig.mode || 'production';



   const serverEntry = nxxtConfig.serverEntry || getServerEntry();

   process.env.NODE_ENV = mode;

   return {
      ...inlineConfig,
      ...nxxtConfig,
      serverEntry,
      mode,
   }
}
