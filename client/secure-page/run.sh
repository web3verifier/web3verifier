#!/bin/bash
set -eux

if [ ! -d "node_modules" ]; then
    npm ci
fi
npm run dev
