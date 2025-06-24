#!/bin/bash

SCRIPT_NAME=${0##*/}
ENVIRONMENT=$1

if [ -z "$SCRIPT_NAME" ]; then
  echo "Usage: build-and-deploy_sh.sh environment-name"
  echo "Environment Names: live or test"
  exit 1
fi

# convert to lower case
ENVIRONMENT=$(echo "$ENVIRONMENT" | tr '[A-Z]' '[a-z]')

# check if the environment argument is live or test
if [[ $ENVIRONMENT != "live" && $ENVIRONMENT != "test" ]]; then
  echo "Usage: ${SCRIPT_NAME} environment"
  echo "Environment Names: LIVE or TEST"
  exit 1
fi

echo "Check environment"
if [ "${ENVIRONMENT}" = "live" ]; then
  S3_BUCKET_NAME="app.elitesportsbets.com"
  DISTRIBUTION_ID="E3K6VDLK0OCNTM"
  BUILD="build:production"
else
  S3_BUCKET_NAME="appdev.elitesportsbets.com"
  DISTRIBUTION_ID="E16OA1S7ZDLKUW"
  BUILD="build:development"
fi

echo "Installing packages"
yarn install

# echo "Build css"
# yarn run build-css

echo "Building"
yarn ${BUILD}

if [ $? != "0" ]; then
  echo "Build FAIL"
  exit 1
fi
echo "Build OK"

echo "Deploying to ${ENVIRONMENT} environment"

echo "Deploying via AWS CLI"
aws s3 sync --delete ./build s3://$S3_BUCKET_NAME --acl public-read --profile esb

echo "Creating CloudFront invalidation"
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths /\* --profile esb

echo "Remove Remote Tag ${ENVIRONMENT}"
git push --delete origin "${ENVIRONMENT}"

echo "Remove Local Tag ${ENVIRONMENT}"
git tag -d "${ENVIRONMENT}"

echo "Set Local Tag ${ENVIRONMENT}"
git tag "${ENVIRONMENT}"

echo "Push Remote Tag ${ENVIRONMENT}"
git push origin "${ENVIRONMENT}"
