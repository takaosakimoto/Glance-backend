#!/usr/bin/env bash

docker push jond3k/glance-server:${GO_PIPELINE_LABEL:?Required}
docker push jond3k/glance-server:latest