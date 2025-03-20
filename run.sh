#!/bin/bash
while true; do
    bash /git/DTUStudyPlan/DTUStudyPlanSoftware/polling.sh
    sleep 60  # Sleep for 60 seconds before checking again
done
