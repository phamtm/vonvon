cd ~/nodejs/daemon
python daemon.py >> ~/nodejs/log/daemon.log &


# Redis
redis-server >> ~/nodejs/log/redis-server.log &

# Client - 8000
cd ~/nodejs/client
python -m SimpleHTTPServer >> ~/nodejs/log/client.log &


# Peer server - 8001
cd ~/peerjs-server
peerjs --port 8001 --key peerjs >> ~/nodejs/log/peerjs.log &


# Server - 8002
cd ~/nodejs/wsgi
node server.js >> ~/nodejs/log/wsgi.log &


service nginx restart
