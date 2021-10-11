# create-nxxt

## Scaffolding Your First Nxxt Project

> **Compatibility Note:**
> Nxxt requires [Node.js](https://nodejs.org/en/) version >=12.0.0.

With NPM:

```bash
$ npm init nxxt@latest
```

With Yarn:

```bash
$ yarn create nxxt
```

With PNPM:

```bash
$ pnpm dlx create-nxxt
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a nxxt project, run:

```bash
# npm 6.x
npm init nxxt@latest my-nxxt-app --template nxxt

# npm 7+, extra double-dash is needed:
npm init nxxt@latest my-nxxt-app -- --template nxxt

# yarn
yarn create nxxt my-nxxt-app --template nxxt

# pnpm
pnpm dlx create-nxxt my-nxxt-app --template nxxt
```

Currently supported template presets include:

- `nxxt`
- `nxxt-ts`
