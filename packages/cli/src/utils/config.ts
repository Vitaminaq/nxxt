import { UserConfig, AliasOptions } from 'vite';
import { getTypeFile, resolveModule } from "./utils";
import { overrideEnv } from './env';
// import { ResolvedOptions } from '@vitejs/plugin-vue';
export const defaultNpxtConfigFile = "npxt.config";

export interface NpxtUserConfig {
  root?: string;
  base?: string;
  mode?: string;
  port?: number;
  serverEntry?: string;
  alias?: AliasOptions;
  vite?: UserConfig;
  vue?: any;
  defaultTemplateDir?: string;
}

export const getNpxtConfig = (): NpxtUserConfig => {
  if (!getTypeFile(defaultNpxtConfigFile)) return {};
  return resolveModule(`./${defaultNpxtConfigFile}`);
};

export const getServerEntry = () => {
  return getTypeFile("src/entry-server");
};

// export interface NpxtConfig {
//   serverEntry: string;
//   vite: UserConfig,
//   alias: AliasOptions;
//   vue: any;
// }

export const loadNpxtConfig = (): NpxtUserConfig => {
  let { vite, serverEntry, mode, alias, vue } = getNpxtConfig();

  mode = mode || (vite && vite.mode);
  mode && overrideEnv(mode);

  alias = Object.assign(alias || {});

  serverEntry = serverEntry || getServerEntry() || '';

  return {
    serverEntry,
    vite: vite || {},
    alias,
    vue: vue || {}
  };
};
