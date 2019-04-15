#!/bin/sh
echo 'Enter db username:'
read name

echo 'Enter db name:'
read db_name

echo 'Enter dump name:'
read dump_name

mysqldump -u $name -p $db_name> $dump_name