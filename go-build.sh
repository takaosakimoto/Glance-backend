#!/usr/bin/env bash

echo Building as "$USER" groups $(groups)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker build \
    --tag=jond3k/glance-server:latest \
    --tag=jond3k/glance-server:${GO_PIPELINE_LABEL:?Required} \
    $DIR