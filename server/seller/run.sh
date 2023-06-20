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

#./node_modules/.bin/ts-node-dev --respawn --poll ./src/server_example1.ts $Port

while true; do
    ps aux | grep "node ./src/create_session_example.js" | grep -v grep | awk '{ print "kill -9", $2 }' | sh
    ./node_modules/.bin/tsc
    node ./src/create_session_example.js $Port &

    inotifywait -e modify ./src/*.ts
done
