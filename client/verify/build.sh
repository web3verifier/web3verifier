#!/bin/bash
set -eux
if [ $# != 1 ]; then
    echo "usage: build.sh [dev|rel]"
    exit
fi
ARG1=$1

if [ ! -d "node_modules" ]; then
    npm ci
fi

if [ $ARG1 = "dev" ]; then
    npm run builddev
elif [ $ARG1 = "rel" ]; then
    npm run buildrel
else
    echo "usage: build.sh [dev|rel]"
    exit
fi

