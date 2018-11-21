#!/bin/bash

#ENV VARIABLES
SERVER_FOLDER=./server;
MONGODB_FOLDER=$SERVER_FOLDER/mongodb;
CLIENT_FOLDER=./client;
IONIC_FOLDER=$CLIENT_FOLDER/test-ionic;

[ `uname -s` != "Darwin" ] && return

# (source: https://gist.github.com/bobthecow/757788)
function tab () {
    local cdto="$PWD"
    local args="$@"

    if [ -d "$1" ]; then
        cdto=`cd "$1"; pwd`
        args="${@:2}"
    fi

    osascript &>/dev/null <<EOF
        tell application "System Events"
            tell process "Terminal" to keystroke "t" using command down
        end tell
        tell application "Terminal"
            activate
            do script with command "cd \"$cdto\"; $args" in selected tab of the front window
        end tell
EOF
}

## START
echo "> start server";
server_file=$SERVER_FOLDER/my-server.js;
mongo_file=$MONGODB_FOLDER/bin/mongod;

# Launch Node Server
tab "node $server_file";
echo "> node server: ok";
# Launch Mongo Daemon
tab "./$mongo_file";
echo "> mongodb: ok";
# Launch Ionic client browser
tab "cd $IONIC_FOLDER; ionic serve -l";
echo "> client: ok";
