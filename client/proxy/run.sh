#!/bin/bash
set -eux

if [ ! -d "node_modules" ]; then
    npm ci
fi
if [ ! -d "src/proxy.js" ]; then
    ./node_modules/.bin/tsc 
fi


./node_modules/.bin/node ./src/proxy.js 
