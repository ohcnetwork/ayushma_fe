import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default [
    {
        input: 'src/index.ts',
        external: ['src/index.css'],
        output: [
            {
                file: '../src/chatbot/index.js',
                format: 'esm',
                banner: '/* eslint-disable */',
            },
            { file: pkg.main, format: 'iife' },
            //{ file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'esm' },
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**',
            }),
            del({ targets: ['public/chatbot/*'] }),
            typescript({
                objectHashIgnoreUnknownHack: true,
            }),
            postcss({
                plugins: [],
            }),
        ],
        external: Object.keys(pkg.peerDependencies || {}),
    },
];