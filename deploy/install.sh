#!/bin/bash
echo "=== VeilPay POS Installer ==="
sudo apt-get update
sudo apt-get install -y chromium-browser unclutter nodejs npm
cd /home/pi/veilpay-pos/frontend
npm install
npm run build
npm install -g serve
cp /home/pi/veilpay-pos/.env.example /home/pi/veilpay-pos/.env
echo ">>> EDIT .env with your API keys before continuing <<<"
sudo cp /home/pi/veilpay-pos/deploy/veilpay-pos.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable veilpay-pos
sudo systemctl start veilpay-pos
mkdir -p /home/pi/.config/autostart
cat > /home/pi/.config/autostart/veilpay-kiosk.desktop << EOF
[Desktop Entry]
Type=Application
Name=VeilPay POS Kiosk
Exec=/home/pi/veilpay-pos/deploy/start-kiosk.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
echo "=== Done. Edit .env then reboot ==="
