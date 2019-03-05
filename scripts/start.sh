#!/bin/sh

sudo systemctl start mysqld
sudo systemctl start redis

xfce4-terminal --working-directory=$(pwd)/../frontend &
xfce4-terminal --working-directory=$(pwd)/../backend &

$BROWSER "http://$(hostname -i | xargs):3000"

code ../ &
