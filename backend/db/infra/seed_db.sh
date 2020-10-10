#!/usr/bin/env bash

# Get root path of the 3dp4me repo
ROOT=$(git rev-parse --show-toplevel)

# Create mock S3 bucket with folders for patients 1-100
if [ -d ${ROOT}/patients_bucket ]; then
    rm -rf ${ROOT}/patients_bucket
fi

for i in $(seq 1 100)
do
    mkdir -p ${ROOT}/patients_bucket/${i}
done

# Create user 3dp4me_api_user
createuser -d 3dp4me_api_user

# Create database 3dp4me_dev
createdb -U 3dp4me_api_user 3dp4me_dev

# Seed the database by running schema.sql
psql 3dp4me_dev < ${ROOT}/backend/db/infra/schema.sql
