#!/bin/sh
echo 'Enter db username:'
read name

echo 'Enter dump name:'
read dump_name

mysql -u $name -p < $dump_name