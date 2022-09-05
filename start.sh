#!/bin/sh
yarn install
(cd games/dice && yarn install)
(cd games/wheel && yarn install)
(cd graphql && yarn install)
(cd statistic && yarn install)
docker-compose up