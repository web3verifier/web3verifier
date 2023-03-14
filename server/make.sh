#!/bin/bash
set -eux

curDir=$(pwd)

cd seller
npm ci
./node_modules/.bin/tsc --build --clean
./node_modules/.bin/tsc

cd "$curDir"

