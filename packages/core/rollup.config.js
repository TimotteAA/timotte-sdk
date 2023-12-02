import pkg from './package.json' assert { type: 'json' };
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
// 把commonjs的第三方模块改变成esmodule
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'src/index.ts',
        output: {
            dir: './dist',
            sourcemap: true,
            format: 'cjs',
        },
    },
    {
        input: 'src/index.ts',
        output: {
            dir: './dist/esm',
            sourcemap: true,
            format: 'esm',
        },
    },
    {
        input: 'src/index.ts',
        output: {
            file: './dist/index.umd.js',
            sourcemap: true,
            format: 'umd',
            name: `TIMOTTE_${pkg.name.split('/')[1].toLocaleUpperCase()}`,
        },
    },
].map((entry) => ({
    ...entry,
    plugins: [
        commonjs(),
        // 处理对第三方库的依赖
        resolve(),
        typescript({
            compilerOptions: {
                declaration: true,
                // declarationDir: `./dist/types`,
                "outDir": "./dist/esm/types",
            },
        }),
    ],
}));
