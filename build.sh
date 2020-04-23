#!/bin/bash

rm -rf dist
echo 'cleaned dist folder'
echo 'compiling TypeScript...'
tsc
echo 'coping assets to dist folder'
cp -R src/views dist/
cp -R src/public dist/
