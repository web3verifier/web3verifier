#!/bin/bash
set -eux

sed -i "s/web3verifier.com/192.168.15.6:4333/g" src/url.ts

if [ ! -d "node_modules" ]; then
    npm ci
fi
./node_modules/.bin/tsc

ps aux | grep webpack| grep -v grep | awk '{ print "kill -9", $2 }' | sh

cd ../../client/verify-page/
    if [ ! -d "node_modules" ]; then
        npm ci
    fi
    npm run dev&
cd ../../server/seller/

sudo node ./src/server_example2.js

