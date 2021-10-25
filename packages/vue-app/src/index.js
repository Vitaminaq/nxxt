import path from 'path'
import { dependencies } from '../package.json'

export const template = {
  dependencies,
  dir: path.join('..', 'template'),
  files: [
    'App.vue',
    'main.ts',
    'entry-client.ts',
    'entry-server.ts',
    'router.ts',
    'store.ts'
  ]
}
