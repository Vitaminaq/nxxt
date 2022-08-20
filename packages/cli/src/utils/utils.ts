import path from "path";
import fs from "fs";
import jiti from "jiti";
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';
import boxen from 'boxen';

const cwd = process.cwd();

export const resolveModule = (p: string) => jiti(path.resolve(cwd))(p).default;

export const resolveVueTemplate = (p: string, n: string) => jiti(p)(n);

export const resolve = (p1: string, p?: string) => path.resolve(p || process.cwd(), p1);

export const isExitFile = (n: string) => fs.existsSync(resolve(n));

export const getTemplate = (p: string) => fs.readFileSync(resolve(p), "utf-8");

export const getDevTemplate = (p: string, n: string) => {
  if (p) return fs.readFileSync(path.resolve(p, n), "utf-8");
  return getTemplate(n);
}

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

export function getMemoryUsage () {
  // https://nodejs.org/api/process.html#process_process_memoryusage
  const { heapUsed, rss } = process.memoryUsage()
  return { heap: heapUsed, rss }
}

export function getFormattedMemoryUsage () {
  const { heap, rss } = getMemoryUsage()
  return `Memory usage: ${chalk.bold(prettyBytes(heap))} (RSS: ${prettyBytes(rss)})`
}

export function showBanner() {
  const titleLines: string[] = [];
  const messageLines: string[] = [];

  const label = (name: string) => chalk.bold.cyan(`▸ ${name}:`);

  titleLines.push(`${label('Environment')} ${process.env.NODE_ENV}`);
  titleLines.push(`${label('Rendering')}   server-side`);

  titleLines.push('\n' + getFormattedMemoryUsage());

  const port = 3000;

  messageLines.push(chalk.bold('\nListening to：'));
  messageLines.push('  👉 ' + chalk.underline.blue(`http://localhost:${port}`));
  // messageLines.push('  👉 ' + chalk.underline.blue(`http://${address()}:${port}`));

  process.stdout.write(boxen([titleLines.join('\n'), messageLines.join('\n')].join('\n'), {
    borderColor: 'green',
    borderStyle: 'round',
    padding: 1,
    margin: 1
  }));
}