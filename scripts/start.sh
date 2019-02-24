#!/bin/sh

sudo systemctl start mysqld
sudo systemctl start redis

xfce4-terminal --working-directory=$(pwd)/../frontend &
xfce4-terminal --working-directory=$(pwd)/../backend &

code ../ &
