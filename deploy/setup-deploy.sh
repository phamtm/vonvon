echo 'Installing redis, nodejs, nginx..'
apt-get install redis nodejs nginx

echo 'Installing pip..'
wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
rm -f get-pip.py


echo 'Setting up nginx config..'
rm -f /etc/nginx/sites-available/vonvon/*.conf
rm -f /etc/nginx/sites-enabled/vonvon/*.conf


# Copy nginx configuration files
mkdir -p /etc/nginx/sites-available/vonvon
mkdir -p /etc/nginx/sites-enabled/vonvon
cp -r nginx/*.conf /etc/nginx/sites-available/vonvon
cp -r nginx/*.conf /etc/nginx/sites-enabled/vonvon
ln -sf /etc/nginx/sites-available/vonvon/client.conf /etc/nginx/sites-enabled/vonvon/client.conf
ln -sf /etc/nginx/sites-available/vonvon/wsgi.conf /etc/nginx/sites-enabled/vonvon/wsgi.conf
ln -sf /etc/nginx/sites-available/vonvon/peer.conf /etc/nginx/sites-enabled/vonvon/peer.conf


echo 'Creating log folder..'
mkdir -p ~/nodejs/log


# Setup nodejs packages
echo 'Setting up node packages..'
cd ~/nodejs/wsgi
npm install
