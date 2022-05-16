#!/bin/sh

while getopts e:p:t: flag
do
    case "${flag}" in
        e) email=${OPTARG};;
        p) password=${OPTARG};;
        t) token=${OPTARG};;
    esac
done

curl -X POST -H 'Content-Type: application/json' -d '{"email": "'"$email"'", "password": "'"$password"'"}' --header "app-token: $token" http://localhost:5000/account/auth 
