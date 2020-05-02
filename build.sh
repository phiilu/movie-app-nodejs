#!/bin/bash

rm -rf dist
echo 'cleaned dist folder'
echo 'compiling Tailwind...'
NODE_ENV=production npx postcss-cli src/styles/index.css -o dist/public/styles/index.css
echo 'compiling TypeScript...'
tsc
echo 'coping assets to dist folder'
cp -R src/views dist/
cp -R src/public dist/