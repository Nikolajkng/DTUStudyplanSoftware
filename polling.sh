#!/bin/bash

REPO_DIR="git/DTUStudyPlan/DTUStudyPlanSoftware"
BRANCH="main"
LAST_COMMIT_FILE="git/DTUStudyPlan/DTUStudyPlanSoftware/.last_commit"

cd $REPO_DIR

# Get the latest commit hash from the repository
LATEST_COMMIT=$(git rev-parse $BRANCH)

# Compare with the last commit stored in a file
if [ -f "$LAST_COMMIT_FILE" ]; then
    LAST_COMMIT=$(cat $LAST_COMMIT_FILE)
else
    LAST_COMMIT=""
fi

if [ "$LATEST_COMMIT" != "$LAST_COMMIT" ]; then
    # New commit detected, pull the latest changes
    echo "New commit detected, pulling latest changes..."

    git pull origin $BRANCH
    npm run build
    PORT=5000 npm start

    # Store the latest commit hash
    echo $LATEST_COMMIT > $LAST_COMMIT_FILE
fi
