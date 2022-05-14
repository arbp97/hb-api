#!/bin/sh

while getopts o:d:a:m:t: flag
do
    case "${flag}" in
        o) origin=${OPTARG};;
        d) destiny=${OPTARG};;
        a) amount=${OPTARG};;
        m) motive=${OPTARG};;
        t) token=${OPTARG};;
    esac
done

curl -X POST -H 'Content-Type: application/json' -d '{"origin":"'"$origin"'","destiny":"'"$destiny"'","amount":'"$amount"',"motive":"'"$motive"'"}' --header "stp-token: $token" http://localhost:5000/account/transfer

