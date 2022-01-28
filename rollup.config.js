import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import externalDeps from 'rollup-plugin-peer-deps-external'
import replace from '@rollup/plugin-replace'

export default [
    {
        input: 'src/index.js',
        output: {
            name: 'PagedHTML',
            file: 'dist/pagedHTML.development.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            replace({ 'process.env.NODE_ENV': `"development"`, delimiters: ['', ''] }),
            babel({
                "runtimeHelpers": true,
            }),
            externalDeps(),
        ],
    },
    {
        input: 'src/index.js',
        output: {
            name: 'PagedHTML',
            file: 'dist/pagedHTML.production.min.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            replace({ 'process.env.NODE_ENV': `"production"`, delimiters: ['', ''] }),
            babel({
                "runtimeHelpers": true,
            }),
            externalDeps(),
            terser(),
            size({
                writeFile: false,
            }),
        ],
    }
]