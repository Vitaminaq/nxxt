import type { Argv } from 'mri'

const _rDefault = r => r.default || r

export const commands = {
  dev: () => import('./dev').then(_rDefault),
//   build: () => import('./build').then(_rDefault),
//   preview: () => import('./preview').then(_rDefault),
//   start: () => import('./preview').then(_rDefault),
//   analyze: () => import('./analyze').then(_rDefault),
//   generate: () => import('./generate').then(_rDefault),
//   prepare: () => import('./prepare').then(_rDefault),
//   typecheck: () => import('./typecheck').then(_rDefault),
//   usage: () => import('./usage').then(_rDefault),
//   info: () => import('./info').then(_rDefault),
//   init: () => import('./init').then(_rDefault),
//   create: () => import('./init').then(_rDefault),
//   upgrade: () => import('./upgrade').then(_rDefault),
//   test: () => import('./test').then(_rDefault),
//   add: () => import('./add').then(_rDefault),
//   new: () => import('./add').then(_rDefault)
}

export type Command = keyof typeof commands

export interface NpxtCommandMeta {
  name: string;
  usage: string;
  description: string;
  [key: string]: any;
}

export type CLIInvokeResult = void | 'error' | 'wait'

export interface NpxtCommand {
  invoke(args: Argv): Promise<CLIInvokeResult> | CLIInvokeResult
  meta: NpxtCommandMeta
}

export function defineNuxtCommand (command: NpxtCommand): NpxtCommand {
  return command
}
