import path from 'path';
import fs from 'fs';

export const resolve = (p: string) => path.resolve(process.cwd(), p);

export const getTemplate = (p: string) => fs.readFileSync(resolve(p), 'utf-8');

const fileTypes = ['js', 'ts'];

export const getTypeFile = (p: string) => {
    const fts = fileTypes.filter((t) => fs.existsSync(resolve(`${p}.${t}`)));
    return fts.length ? `${p}.${fts[0]}` : null;
};
