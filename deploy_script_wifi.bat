ECHO "deploying files"

pscp -pw raspberry ./cameralogic.js pi@192.168.10.1:/home/pi/scan-me
pscp -pw raspberry ./scancamera.js pi@192.168.10.1:/home/pi/scan-me
pscp -r -pw raspberry ./public/* pi@192.168.10.1:/home/pi/scan-me/public


plink pi@192.168.10.1 -pw raspberry /home/pi/scan-me/restart.sh