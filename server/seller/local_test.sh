#!/bin/bash
set -eux

if [ $# != 1 ]; then
    echo "usage: ./local_test.sh ThisHostIPAddress"
    exit
fi

address=$1

echo $address

git checkout src/url.ts
sed -i "s/web3verifier.com/$address:4433/g"          src/url.ts
sed -i "s/server.listen(443,/server.listen(44300,/g" src/server_example1.ts
sed -i "s/:443\//:44300\//g"                         src/server_example1.ts
sed -i "s/This_Host_IP_Address/$address/g"           src/server_example1.ts

if [ ! -d "node_modules" ]; then
    npm ci
fi

ps aux | grep webpack| grep -v grep | awk '{ print "kill -9", $2 }' | sh

cd ../../client/verify-page/
    if [ ! -d "node_modules" ]; then
        npm ci
    fi
    npm run dev&
cd ../../server/seller/

cd ../../client/secure-page/
    if [ ! -d "node_modules" ]; then
        npm ci
    fi
    npm run dev&
cd ../../server/seller/

ps aux | grep "node proxy.js" | grep -v grep | awk '{ print "kill -9", $2 }' | sh

cd ../../client/proxy/
    if [ ! -d "node_modules" ]; then
        npm ci
    fi
    if [ ! -d "src/proxy.js" ]; then
        ./node_modules/.bin/tsc ./src/proxy.ts
    fi
    node ./src/proxy.js &
cd ../../server/seller/

./node_modules/.bin/ts-node-dev ./src/server_example1.ts
