#!/bin/sh
xset -dpms
xset s off
xset s noblank
unclutter &
matchbox-window-manager &
midori -e Fullscreen -a http://killmenos9.interzonas.info