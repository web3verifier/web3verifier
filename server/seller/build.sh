#!/bin/bash
set -eux

if [ ! -d "node_modules" ]; then
    npm ci
fi
./node_modules/.bin/tsc node_modules/@solana/web3.js/src/utils/ed25519.ts
#./node_modules/.bin/tsc src/server_all.ts
./node_modules/.bin/tsc 

