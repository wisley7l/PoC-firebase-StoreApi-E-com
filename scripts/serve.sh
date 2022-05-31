#!/bin/bash

bash scripts/start.sh &

inotifywait -rqm --event close_write --format '%w%f' \
  functions/src |
  while read -r filepath file; do
    if [[ $filepath =~ \.ts$ ]]; then
      pkill node
      echo 'test '
    fi
    bash scripts/start.sh &
  done
