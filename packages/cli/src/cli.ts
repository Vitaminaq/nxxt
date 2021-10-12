import { build } from 'vite';
import { getNxxtConfig } from './config';
import { buildOptions } from './build';

build(buildOptions);

console.log(getNxxtConfig());