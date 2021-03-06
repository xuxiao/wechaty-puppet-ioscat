#!/usr/bin/env bash
set -e

NPM_TAG=latest
if [ ./development-release.ts ]; then
  NPM_TAG=next
fi

npm run dist
npm run pack

TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.ts "$TMPDIR"

cd $TMPDIR
npm init -y
npm install *-*.*.*.tgz \
  @types/quick-lru \
  @types/lru-cache \
  @types/node \
  @types/normalize-package-data \
  brolog \
  file-box \
  hot-import \
  lru-cache \
  memory-card \
  normalize-package-data \
  state-switch \
  typescript \
  "wechaty-puppet@$NPM_TAG" \
  watchdog \

./node_modules/.bin/tsc \
  --esModuleInterop \
  --lib esnext \
  --noEmitOnError \
  --noImplicitAny \
  --target es6 \
  --module commonjs \
  smoke-testing.ts

node smoke-testing.js
