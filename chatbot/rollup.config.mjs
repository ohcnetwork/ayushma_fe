import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';

const tailwindConfig = require('./tailwind.config.js');

export default [
    {
        input: 'src/index.ts',
        external: ['src/**/*'],
        output: [
            {
                file: '../src/chatbot/index.js',
                format: 'cjs',
                banner: '/* eslint-disable */',
            },
            //{ file: pkg.main, format: 'iife' },
            //{ file: pkg.main, format: 'cjs' },
            //{ file: pkg.module, format: 'esm' },
        ],
        plugins: [
            postcss({
                extensions: ['.css'],
                plugins: [tailwindcss(tailwindConfig)],
            }),
            //del({ targets: ['public/chatbot/*'] }),
            typescript({
                objectHashIgnoreUnknownHack: true,
            }),
        ],
        external: Object.keys(pkg.peerDependencies || {}),
    },
];