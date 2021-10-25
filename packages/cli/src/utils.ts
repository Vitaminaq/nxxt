import path from "path";
import fs from "fs";
import jiti from "jiti";

const cwd = process.cwd();

export const resolveModule = (p: string) => jiti(path.resolve(cwd))(p).default;

export const resolveVueTemplate = (p: string, n: string) => jiti(p)(n);

export const resolve = (p: string) => path.resolve(process.cwd(), p);

export const getTemplate = (p: string) => fs.readFileSync(resolve(p), "utf-8");

const fileTypes = ["js", "ts"];

export const getTypeFile = (p: string) => {
  const fts = fileTypes.filter((t) => fs.existsSync(resolve(`${p}.${t}`)));
  return fts.length ? `${p}.${fts[0]}` : null;
};

export const getDirFiles = (folderName: string) => {
  const path = resolve(folderName);
  if (!fs.existsSync(path)) return [];
  return fs.readdirSync(path);
};
