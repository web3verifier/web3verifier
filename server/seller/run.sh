#!/bin/bash
set -eux

if [ $# = 1 ]; then
    Port=$1
else
    echo "usage: ./run.sh Port"
    exit
fi

if [ ! -d "node_modules" ]; then
    npm ci
fi
./node_modules/.bin/ts-node-dev ./src/server_example1.ts $Port
