#!/usr/bin/env bash
set -e

# Take built CLI
mkdir ./dist-docker/
mkdir ./dist-docker/docker/
cp -r ./dist ./dist-docker/docker/
cp ./package.json ./dist-docker/docker/
cp ./config.default.json ./dist-docker/docker/
mkdir ./dist-docker/docker/help/
cp -r ./help/cli-commands ./dist-docker/docker/help/cli-commands
cp -r ./pysrc ./dist-docker/docker/pysrc

# Snyk CLI entry script
cp ./release-scripts/snyk-mac-arm64.sh ./dist-docker/docker/

cd ./dist-docker/docker/

# Download macOS NodeJS binary, using same as pkg
curl "https://nodejs.org/dist/v16.13.1/node-v16.13.1-darwin-arm64.tar.gz" | tar -xz

cd ..

# Create bundle, resolve symlinks
tar czfh docker-mac-signed-bundle-arm64.tar.gz ./docker
# final package must be at root, otherwise it gets included in /dist folder
mv ./docker-mac-signed-bundle-arm64.tar.gz ../binary-releases/
cd ..

pushd binary-releases
shasum -a 256 docker-mac-signed-bundle-arm64.tar.gz >docker-mac-signed-bundle-arm64.tar.gz.sha256
popd

rm -rf ./dist-docker
