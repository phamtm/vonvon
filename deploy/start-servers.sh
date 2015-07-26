cd ~/nodejs/daemon
python daemon.py >> ~/nodejs/daemon.log


# Client - 8000
cd ~/nodejs/client
python -m SimpleHTTPServer >> ~/nodejs/client.log


# Peer server - 8001
cd ~/peerjs-server
peerjs --port 8001 --key peerjs &


# Server - 8002
cd ~/wsgi
node server.js >> ~/nodejs/wsgi.log
