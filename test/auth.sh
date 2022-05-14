#!/bin/sh

while getopts e:p: flag
do
    case "${flag}" in
        e) email=${OPTARG};;
        p) password=${OPTARG};;
    esac
done

curl -X POST -H 'Content-Type: application/json' -d '{"email": "'"$email"'", "password": "'"$password"'"}' http://localhost:5000/account/auth
