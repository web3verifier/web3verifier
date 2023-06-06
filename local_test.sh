#!/bin/bash
set -eux

if [ $# != 1 ]; then
    echo "usage: ./local_test.sh ThisHostIPAddress"
    exit
fi

address=$1
echo $address

git checkout ./server/seller/src/url.ts

sed -i "s/web3verifier.com/$address:4433/g"          ./server/seller/src/url.ts

ps aux | grep webpack| grep -v grep | awk '{ print "kill -9", $2 }' | sh

cd ./client/verify/
    ./build.sh dev
    cp dist/verify* ../../server/seller/
cd ../../

cd ./client/verifycore/
    ./run.sh &
cd ../../

cd ./client/secure/
    ./run.sh &
cd ../../

ps aux | grep "node ./src/proxy.js" | grep -v grep | awk '{ print "kill -9", $2 }' | sh

cd ./client/proxy/
    ./run.sh &
cd ../../

cd ./server/seller/
./run.sh 44300

