const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const copy = require('rollup-plugin-copy');

module.exports = {
    // This function will run for each entry/format/env combination
    rollup(config, options) {
        config.watch = {
            include: 'src/**',
            ...config.watch
        }
        config.plugins.push(
            copy({
                targets: [
                    { src: 'src/views/**/*.html', dest: 'dist/' }
                ],
                flatten: false
            }),
            postcss({
                plugins: [
                    tailwindcss,
                    autoprefixer(),
                ],
                inject: false,
                // only write out CSS for the first bundle (avoids pointless extra files):
                extract: 'public/styles/index.css',
            }),
        );
        return config; // always return a config.
    },
};