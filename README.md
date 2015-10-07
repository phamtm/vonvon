## Introduction
Vonvon setup. You might want to install [docker](https://docs.docker.com/installation/) first
## Build and Run
Run redis single/cluster node. Refer to [redis-docker](https://hub.docker.com/_/redis/)
```sh
docker run --net=host --name redis --restart=always -d redis
```

Run socket io 
```sh
docker run --net=host --name socketio -v /{SHARE FOLDER KEY}/:/keys/ -v /{SHARE FOLDER GIT}/:/vonvon/ --restart=always -d vonvonvn/socketio
```

Run peerjs
```sh
docker run --net=host --name peerjs /{SHARE FOLDER KEY}/:/home/ubuntu/keys/ --restart=always -d vonvonvn/peerjs
```

Run matcher
```sh
docker run --net=host --name matcher -v /{SHARE GIT FOLDER}/:/vonvon/ --restart=always -d matcher
```

## Demo
https://www.vonvon.vn/

## Contacts
[Frank Tran](https://bitbucket.org/PrinceP3)
[Minh Pham](https://bitbucket.org/phamminh91)
