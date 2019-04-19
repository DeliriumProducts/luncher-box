#!/bin/sh
cd backend

while true; 
do
    yarn test;
    status=$?
    if [[ $status != 0 ]]; then
        echo "$status" >> failed_tests;
    fi
done
