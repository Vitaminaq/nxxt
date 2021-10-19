import path from 'path';
import fs from 'fs';

export const resolve = (p: string) => path.resolve(process.cwd(), p);

export const getTemplate = (p: string) => fs.readFileSync(resolve(p), 'utf-8');