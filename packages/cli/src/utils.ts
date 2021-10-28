import path from "path";
import fs from "fs";
import jiti from "jiti";
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';
import boxen from 'boxen';

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

export function getMemoryUsage () {
  // https://nodejs.org/api/process.html#process_process_memoryusage
  const { heapUsed, rss } = process.memoryUsage()
  return { heap: heapUsed, rss }
}

export function getFormattedMemoryUsage () {
  const { heap, rss } = getMemoryUsage()
  return `Memory usage: ${chalk.bold(prettyBytes(heap))} (RSS: ${prettyBytes(rss)})`
}

export function showBanner(nxxt: any) {
  const titleLines = [];
  const messageLines = [];

  const label = (name: string) => chalk.bold.cyan(`▸ ${name}:`);

  titleLines.push(`${label('Environment')} ${process.env.NODE_ENV}`);
  titleLines.push(`${label('Rendering')}   server-side`);

  titleLines.push('\n' + getFormattedMemoryUsage());

  const { render } = nxxt;
  const { port = 3000 } = render.ssr.config;

  messageLines.push(chalk.bold('\nListening to：'));
  messageLines.push('  👉 ' + chalk.underline.blue(`http://localhost:${port}`));
  messageLines.push('  👉 ' + chalk.underline.blue(`http://${require("ip").address()}:${port}`));

  process.stdout.write(boxen([titleLines.join('\n'), messageLines.join('\n')].join('\n'), {
    borderColor: 'green',
    borderStyle: 'round',
    padding: 1,
    margin: 1
  }))
}