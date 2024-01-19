#!/bin/bash

# This is the build script that code pipeline will use to deploy the app. It builds the docker file,
# directly injecting environment variables. Then it publishes the container and updates the AWS config
# file to reference it. The output that should be uploaded to ELB is put into ./elb-build. A zipped
# version is placed into elb-build/build.zip

# The following env variables must be set:
# DOPPLER_TOKEN:           token
# DOPPLER_CONFIG:          prd | dev | gov | stg
# GITHUB_TOKEN:            token that can write packages
# DOCKER_TOKEN:            token from free account for fetching images

# Delete the old build
rm -rf ../elb-build

# Export variables needed for the build
export SHAPECI_DOPPLER_TOKEN="$DOPPLER_TOKEN"
export ENV="$DOPPLER_CONFIG"

# Determine this version tag
VERSION=$(jq -r .version ../package.json)
TAG=$(jq -r .tag ../package.json)
export VERSION_TAG="$VERSION-$ENV-$TAG"

# Need to log into the docker container registry so that when we pull from 
# node:alpine we don't get rate limited
echo $DOCKER_TOKEN | docker login -u mattwalowski --password-stdin

# Do the build
sh build.sh

# Logout now. We actually publish to ghcr.io
docker logout

# Publish the image
sh publish.sh

# Prepare the build folder
cp -r ../aws ../elb-build

# Update the version referenced in the AWS config
COMPLETE_VERSION="ghcr.io/shapeci/api:$VERSION_TAG"
jq --arg version "$COMPLETE_VERSION" '.Image.Name = $version' ../aws/Dockerrun.aws.json > ../aws/Dockerrun.tmp
mv ../aws/Dockerrun.tmp ../elb-build/Dockerrun.aws.json

zip ../elb-build/build.zip ../elb-build