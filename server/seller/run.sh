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
    ./node_modules/.bin/tsc
    cd ./src
        set +e
        ps aux | grep "node ./create_session.js" | grep -v grep | awk '{ print "sudo kill -9", $2 }' | sh
        set -e
        sudo .././node_modules/.bin/node ./create_session.js $Port &
        inotifywait -e modify ./*.ts
    cd ..

done
