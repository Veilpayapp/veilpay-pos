#!/bin/bash
sleep 8
export DISPLAY=:0
xset s off
xset -dpms  
xset s noblank
unclutter -idle 0 &
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --app=http://localhost:5173 \
  --window-size=800,480 \
  --window-position=0,0 \
  --disable-pinch \
  --overscroll-history-navigation=0
