#!/bin/sh

while getopts d:t: flag
do
    case "${flag}" in
        d) dni=${OPTARG};;
        t) token=${OPTARG};;
    esac
done

curl -X POST -H 'Content-Type: application/json' -d '{"dni": '$dni' }' --header "stp-token: $token" http://localhost:5000/accounts/user
