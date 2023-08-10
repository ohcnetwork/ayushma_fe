import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import tailwindcss from 'tailwindcss';
import pkg from './package.json';

const tailwindConfig = require('./tailwind.config.js');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                name: "Chatbot",
                file: pkg.main,
                format: 'iife',
                sourcemap: "inline",
                inlineDynamicImports: true,
                globals: {
                    "react/jsx-runtime": "jsxRuntime",
                    "react-dom/client": "ReactDOM",
                    "react": "React",
                    "jotai": "jotai",
                },
            },
        ],

        plugins: [
            nodeResolve(),
            esbuild(),
            postcss({
                extensions: ['.css'],
                plugins: [tailwindcss(tailwindConfig)],
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('dev')
            }),
            commonjs(),
            babel({
                babelHelpers: "bundled",
                exclude: 'node_modules/**',
                presets: [["@babel/preset-react", { "runtime": "automatic" }]]
            }),
        ],
    },
];