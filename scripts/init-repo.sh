#!/bin/sh

git config core.sparsecheckout true
git update-index --skip-worktree 'backend/development.env'
git update-index --skip-worktree 'backend/production.env'
git update-index --skip-worktree 'frontend/development.env'
git update-index --skip-worktree 'frontend/production.env'

touch .git/info/sparse-checkout
echo "/*\n!*.env" >> .git/info/sparse-checkout