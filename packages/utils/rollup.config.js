import pkg from './package.json' assert { type: 'json' };
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
// 把commonjs的第三方模块改变成esmodule
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        external: ['dayjs'],
        input: 'src/index.ts',
        output: {
            dir: './dist',
            sourcemap: true,
            format: 'cjs',
        },
    },
    {
        external: ['dayjs'],
        input: 'src/index.ts',
        output: {
            dir: './dist/esm',
            sourcemap: true,
            format: 'esm',
        },
    },
    {
        external: ['dayjs'],
        input: 'src/index.ts',
        output: {
            file: './dist/index.umd.js',
            sourcemap: true,
            format: 'umd',
            name: `TIMOTTE_${pkg.name.split('/')[1].toLocaleUpperCase()}`,
            globals: {
                dayjs: 'dayjs', // dayjs 的全局变量名
                'dayjs/plugin/advancedFormat': 'advancedFormat', // 同理为其他插件指定全局变量名
                'dayjs/plugin/customParseFormat': 'customParseFormat',
                'dayjs/plugin/dayOfYear': 'dayOfYear',
                'dayjs/plugin/localeData': 'localeData',
                'dayjs/plugin/timezone': 'timezone',
                'dayjs/plugin/utc': 'utc',
            },
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
                declarationDir: './dist/esm/types',
            },
        }),
    ],
}));