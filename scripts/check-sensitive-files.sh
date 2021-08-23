#!/bin/bash
ROOT_DIR="$(pwd)/"
LIST=$(git diff --cached --name-only --diff-filter=ACRM)
FORBIDDEN_FILES=(backend/production.env backend/development.env frontend/production.env frontend/development.env)

for file in "${FORBIDDEN_FILES[@]}"
do
    if $(git diff --exit-code $file); 
    then
        continue
    else
        
        echo You cannot commit file $file! Run the following command:
        echo git reset HEAD -- $file
    fi
done
exit 0