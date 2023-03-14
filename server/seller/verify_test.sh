#!/bin/bash
set -eux

./node_modules/.bin/tsc --build --clean
./node_modules/.bin/tsc

ps aux | grep webpack| grep -v grep | awk '{ print "kill -9", $2 }' | sh

cd ../../client/verify-page/
npm run dev&
cd ../../server/seller/

sudo node ./src/server_example2.js

