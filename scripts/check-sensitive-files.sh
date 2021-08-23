#!/bin/bash

ROOT_DIR="$(pwd)/"
LIST=$(git diff --cached --name-only --diff-filter=ACRM)

for file in $LIST
do
        echo $(pwd)
    if [[ "${file: -4}" == *.env ]]; then
        
        echo
        echo You cannot commit file $file! Did you run the init script?
        echo From the root of the repo, run yarn init-repo
        exit 1
    fi
done
exit 0