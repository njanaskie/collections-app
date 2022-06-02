#!/bin/bash

echo What should the version be?
read VERSION

docker build -t nickjanaskie/collections-app:$VERSION .
docker push nickjanaskie/collections-app:$VERSION