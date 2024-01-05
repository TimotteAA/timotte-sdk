import path from "path";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
// import type { RollupOptions } from "rollup";

const packageDir = path.resolve(__dirname);
const packageDirDist = `${packageDir}/dist`;

const name = path.basename(packageDir);

export const base = {
  input: "src/index.ts", // 你的 TypeScript 入口文件
  output: {
    name: `TIMOTTE_${name.toLocaleUpperCase()}`,
  },
  plugins: [
    nodeResolve(), // 解析 node_modules 中的模块
    typescript(), // 处理 TypeScript
  ],
};

export const umdPackage = {
  ...base,
  output: {
    file: `${packageDirDist}/${name}.umd.js`,
    format: "umd",
    ...base.output,
  },
};
