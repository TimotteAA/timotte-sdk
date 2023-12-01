import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
const packageDir = path.resolve(__dirname);
const packageDirDist = `${packageDir}/dist`;
const name = path.basename(packageDir);
export const base = {
    input: "src/index.ts",
    output: {
        name: `TIMOTTE_${name.toLocaleUpperCase()}`,
    },
    plugins: [
        nodeResolve(),
        typescript(),
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
//# sourceMappingURL=rollup-base.config.js.map