#!/bin/bash
set -eux

if [ ! -d "../seller/node_modules" ]; then
    cd ../seller/ 
    npm ci
    cd ../landing
fi
./node_modules/.bin/tsc node_modules/@solana/web3.js/src/utils/ed25519.ts
./node_modules/.bin/tsc 

