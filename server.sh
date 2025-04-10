#!/bin/bash

npm run build
while true; do
  echo "Starting server..."
  PORT=5000 npm start
  echo "Server interrupted by git pull $?. Restarting..." 
  sleep 1
done