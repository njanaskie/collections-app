#!/bin/bash

echo What should the version be?
read VERSION

docker build -t njanaskie/collections:$VERSION .
docker push njanaskie/collections:$VERSION
ssh root@157.230.226.155 "docker pull njanaskie/collections:$VERSION && docker tag njanaskie/collections:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"