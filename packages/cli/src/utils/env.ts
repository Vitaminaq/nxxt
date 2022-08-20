/**
 * 环境变量
 */
export const overrideEnv = (targetEnv: string) => {
    const currentEnv = process.env.NODE_ENV
    if (currentEnv && currentEnv !== targetEnv) {
      console.warn(`Changing \`NODE_ENV\` from \`${currentEnv}\` to \`${targetEnv}\`, to avoid unintended behavior.`)
    }
  
    process.env.NODE_ENV = targetEnv
}

export const overrideRunType = (runType: 'build' | 'devServer') => {
    const current = process.env.RUN_TYPE
    if (current && current !== runType) {
      console.warn(`Changing \`RUN_TYPE\` from \`${current}\` to \`${runType}\`, to avoid unintended behavior.`)
    }
  
    process.env.RUN_TYPE = runType
}

export const isBuild = () => process.env.RUN_TYPE === 'build';

export const isProd = () => process.env.NODE_ENV === 'production';
