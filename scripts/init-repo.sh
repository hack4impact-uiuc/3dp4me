#!/bin/bash

git config core.sparsecheckout true
git update-index --skip-worktree 'backend/development.env'
git update-index --skip-worktree 'backend/production.env'
git update-index --skip-worktree 'frontend/development.env'
git update-index --skip-worktree 'frontend/production.env'

touch .git/info/sparse-checkout
echo "/*" > .git/info/sparse-checkout
echo "!*.env" >> .git/info/sparse-checkout