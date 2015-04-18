>&2 echo arg1 _ $1
>&2 echo arg2 _ $2

imagedimensions=$(identify -ping $1  | { read first second third fourth ; echo $third;})
>&2 echo dimensions _ $imagedimensions

#cut the info to retrieve only size on 1 direction

imagewidth=$(echo $imagedimensions | cut -d'x' -f2)
imageheight=$(expr $2 \* $imagewidth / 100)

>&2 echo width _ $imagewidth
>&2 echo height _ $imageheight

imageregion=$(echo ${imagewidth}x$imageheight)

>&2 echo region _ $imageregion
#tempfilename=$(echo $1.$imagedimensions.jpg)

#echo $tempfilename

stream -map rgb -storage-type char -extract $imageregion $1 - | convert -depth 8 -size $imageregion rgb:-  jpg:- 