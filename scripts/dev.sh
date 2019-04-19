#!/bin/sh

sudo systemctl start mysqld
sudo systemctl start redis

xfce4-terminal -T luncherbox-frontend --working-directory=$(pwd)/../frontend --tab  -T luncherbox-backend --working-directory=$(pwd)/../backend --tab &

$BROWSER "http://$(hostname -i | xargs):3000"

code ../ &
