#!/bin/sh

ROOT_DIR="$(pwd)/"
LIST=$(git diff --cached --name-only --diff-filter=ACRM)

for file in $LIST
do
    if [[ "${file: -4}" == *.env ]]; then
        echo
        echo You cannot commit file $file, you might publish our AWS secrets! To ignore all future changes to $file, run the following command:
        echo
        echo git reset && git update-index --assume-unchanged $file
        exit 1
    fi
done
exit 0