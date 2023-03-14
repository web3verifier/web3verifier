#!/bin/bash
set -eux

curDir=$(pwd)
cd verify-page/
npm ci
./node_modules/.bin/webpack --config webpack.config.rel.js --stats-error-details
cd "$curDir"

cd secure-page/
npm ci
./node_modules/.bin/webpack --config webpack.config.rel.js --stats-error-details
cd "$curDir"

