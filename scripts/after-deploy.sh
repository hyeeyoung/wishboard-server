#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

cd dist

sudo /usr/bin/pm2 del server

sudo /usr/bin/pm2 start server.js
