ECHO "deploying files"

pscp -pw raspberry ./cameralogic.js pi@192.168.137.2:/home/pi/scan-me
pscp -pw raspberry ./scancamera.js pi@192.168.137.2:/home/pi/scan-me
pscp -r -pw raspberry ./public/* pi@192.168.137.2:/home/pi/scan-me/public


plink pi@192.168.137.2 -pw raspberry /home/pi/scan-me/restart.sh