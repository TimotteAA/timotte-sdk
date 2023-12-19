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
            // external: ['@timote-sdk/utils'],
        },
    },
    {
        input: 'src/index.ts',
        output: {
            // dir: './dist/esm',
            dir: './dist/esm',
            sourcemap: true,
            format: 'esm',
            // external: ['@timote-sdk/utils'],
        },
    },
    {
        input: 'src/index.ts',
        output: {
            file: './dist/index.umd.js',
            // dir: './dist',
            sourcemap: true,
            format: 'umd',
            name: `TIMOTTE_${pkg.name.split('/')[1].toLocaleUpperCase()}`,
            // external: ['@timote-sdk/utils'],
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
                outDir: './dist/esm/types',
            },
        }),
    ],
}));
