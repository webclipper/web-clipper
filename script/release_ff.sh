#!/bin/bash

docker build -t webclipper:release .

docker run -v $PWD:/opt/mount --rm --entrypoint cp webclipper:release /temp/release/web_clipper_firefox.zip /opt/mount/dist/web_clipper_firefox_docker.zip

