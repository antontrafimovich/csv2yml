from node:20.11-bookworm
workdir /src
copy package.json package-lock.json ./
run npm ci
copy . .
cmd ['/bin/sh']

