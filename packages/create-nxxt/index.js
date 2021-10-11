#!/usr/bin/env node

const fs = require("fs");
const path = require('path');
const prompts = require("prompts");
const fse = require('fs-extra');
const { yellow, blue, red } = require('kolorist');

const argv = require("minimist")(process.argv.slice(2), { string: ["_"] });

const cwd = process.cwd()

const TEMPLATES = [{
    name: 'nxxt',
    display: 'JavaScript',
    color: yellow
}, {
    name: 'nxxt-ts',
    display: 'TypeScript',
    color: blue
}];

const TEMPLATE_NAMES = TEMPLATES.map(i => i.name);

function isEmpty(path) {
  return fs.readdirSync(path).length === 0;
}

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

async function init() {
  let targetDir = argv._[0];
  let template = argv.template || argv.t;

  const defaultProjectName = !targetDir ? "nxxt-project" : targetDir;

  const result = await prompts([
    {
      type: targetDir ? null : "text",
      name: "projectName",
      message: "Project name:",
      initial: defaultProjectName,
      onState: (state) =>
        (targetDir = state.value.trim() || defaultProjectName),
    },
    {
      type: () =>
        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
      name: "overwrite",
      message: () =>
        (targetDir === "."
          ? "Current directory"
          : `Target directory "${targetDir}"`) +
        ` is not empty. Remove existing files and continue?`,
    },
    {
      type: (_, { overwrite } = {}) => {
        if (overwrite === false) {
          throw new Error(red("✖") + " Operation cancelled");
        }
        return null;
      },
      name: "overwriteChecker",
    },
    {
      type: () => (isValidPackageName(targetDir) ? null : "text"),
      name: "packageName",
      message: "Package name:",
      initial: () => toValidPackageName(targetDir),
      validate: (dir) => isValidPackageName(dir) || "Invalid package.json name",
    },
    {
      type: template && TEMPLATE_NAMES.includes(template) ? null : 'select',
      name: 'variant',
      message: 'Select a variant:',
      choices: TEMPLATES.map((variant) => {
        const variantColor = variant.color
        return {
        title: variantColor(variant.name),
        value: variant.name
        }
      })
    }
  ], {
    onCancel: () => {
      throw new Error(red('✖') + ' Operation cancelled')
    }
  });

  const { overwrite, packageName, variant } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    fse.emptyDirSync(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  template = variant || template;

  const templateDir = path.join(__dirname, template.replace('nxxt', 'template'));

  fse.copySync(templateDir, root);

  const pkg = require(path.join(root, 'package.json'));

  pkg.name = packageName || targetDir;

  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg, null, 2))

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}

init();
