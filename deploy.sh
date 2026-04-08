#!/bin/bash
# Run this on the FRONTEND EC2 instance
# Usage: bash deploy.sh

set -e

BACKEND_EC2_IP="<BACKEND_EC2_PUBLIC_IP>"   # <-- replace

echo "=== Installing Node 16 ==="
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== Installing Angular CLI ==="
sudo npm install -g @angular/cli@9

echo "=== Installing dependencies ==="
cd /home/ubuntu/legacy_frontend
npm install

echo "=== Updating backend API URL ==="
sed -i "s|BACKEND_EC2_PUBLIC_IP|${BACKEND_EC2_IP}|g" src/environments/environment.prod.ts

echo "=== Building Angular app ==="
ng build --prod

echo "=== Installing Nginx ==="
sudo apt-get install -y nginx

echo "=== Configuring Nginx ==="
sudo cp nginx.conf /etc/nginx/sites-available/blog
sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default

echo "=== Installing systemd service ==="
sudo cp blog-frontend.service /etc/systemd/system/blog-frontend.service
sudo systemctl daemon-reload
sudo systemctl enable blog-frontend
sudo systemctl restart blog-frontend

echo "=== Opening port 80 in firewall ==="
sudo ufw allow 80/tcp || true

echo "=== Done! Frontend running on http://0.0.0.0:80 ==="
sudo systemctl status blog-frontend --no-pager
