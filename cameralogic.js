var fs = require('fs');
var mkdirp = require('mkdirp');
var child_process = require('child_process');
var spawn = child_process.spawn;

var cameraInUse = true;
var clickNB = -1;


exports.definitions = {
  uld:50,
  ld:100,
  sd:200,
  hd:300,
  uhd:400
}


//is directory missing ?
var stats = fs.lstatSync('./raw');
if (!stats.isDirectory()) {
  mkdirp('./raw', function(err) { 
    console.log ('created missing raw folder');
  });
}

var stats = fs.lstatSync('./pictures');
if (!stats.isDirectory()) {
  mkdirp('./pictures', function(err) { 
    console.log ('created missing pictures folder');
  });
}

//get the current clickNB
console.log('trying to determine clickNB');
fs.readdir( './raw', function(err, list) {
  if(err)
      throw err;
  var regex = new RegExp("img(\\d+)\.tiff");
  list.forEach( function(item) {
    console.log('reading file name : ' + item);
    var matches = item.match(regex);
    console.log(matches);
    if( matches ) {
      if(parseInt(matches[1]) > clickNB){
        clickNB =  parseInt(matches[1]) + 1 ;
        console.log('found photo for click : ' + matches[1]);
      }
    }else{
      console.log(matches);
    }

  }); 

  cameraInUse = false;
  console.log("camera initiated with click nb = " + clickNB);
});


exports.getClickNB = function(){
  return clickNB;
}

exports.getLastPictureFilename = function(){
  return '/img'+(clickNB-1)+'.jpg';
}


exports.snap = function (definition, progress, done){
	return scan(definition, progress, done);
}


exports.preview = function (){

	return 'preview';
}



function scan(definition, progress, done){
  console.log('scan called');




	if(!cameraInUse){

    console.log('scan commencing');

		cameraInUse=true;
		var imageIndex = clickNB;

    var scanProcess  = spawn('scanimage', ['-p','-x', '200', '-y', '200', '-l', '5', '-t', '55', '--format=tiff', '--resolution='+definition]);

    fs.writeFile('./raw/img'+imageIndex+'.tiff','',function(){
      console.log('file initiated');
    })


    scanProcess.stdout.on('data', function(data){
      fs.appendFile('./raw/img'+imageIndex+'.tiff', data, function(){
      })
    });


    var progressIndex = 1;
    var progressStep = 10;


    scanProcess.stderr.on('data', function(data){
        //progress is written to stderr.
        //let's process it to strip useless text and send it to the progress callbak
        var regex = new RegExp("Progress: (\\d+)\..%");

        var matches = (""+data).match(regex);
        if( matches ) {
            var progresspercentage = parseInt(matches[1]);
            if(progresspercentage >= progressIndex * progressStep){
              //consider trying to stream | convert the unfinished file every 10%

              var previewProcess  = spawn('sh',['-c','./do_preview.sh ./raw/img'+imageIndex+'.tiff '+ progresspercentage]);                                         

              var buffers = [];

              previewProcess.stdout.on('data',function(imagedata){
                buffers.push(imagedata);
              })

              previewProcess.stderr.on('data',function(imagedata){
                console.log("got error"+ imagedata);
              })

              previewProcess.stdout.on('end', function(){
                progress(progresspercentage, (Buffer.concat(buffers)).toString('base64'));
              })
              
              //previewProcess.on('close', function(code,signal){
              //  progress(progresspercentage, (Buffer.concat(buffers)).toString('base64'));
              //  console.log("reached progress threshold and conversion done");
              //  console.log((Buffer.concat(buffers)).toString('base64'));
              //})
              

              progressIndex++;       

            }else{
              progress(matches[1], null);
            }
        }
      });


    var convertProcess =  spawn('convert', ['tiff:-','-quality','60', './pictures/img'+imageIndex+'.jpg']);
    scanProcess.stdout.pipe(convertProcess.stdin);


    convertProcess.on('close', function(code,signal){
        console.log("convert done");

        //scanned ended 
        
        clickNB++;

        cameraInUse = false;

        //lets call the done callback with the id of the picture
        done('img'+clickNB+'.jpg');
      });


		return true;
	}else{
		//cannot scan, it is already in use !
		return false;
	}


}
