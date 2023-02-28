#!/bin/bash

docker compose build
docker compose up -d
docker exec -d backend npm run dev
docker exec -d frontend npm run dev
