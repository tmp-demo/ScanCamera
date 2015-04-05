var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;

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





exports.snap = function (definition){
	return scan(definition);
}


exports.preview = function (){

	return 'preview';
}



function scan(definition){
  console.log('scan called');
	if(!cameraInUse){
		cameraInUse=true;
		var imageIndex = clickNB;

    var scanProcess  = spawn('scanimage', ['-x', '200', '-y', '200', '-l', '5', '-t', '55', '--format=tiff', '--resolution='+definition]);

    fs.writeFile('./raw/img'+imageIndex+'.tiff','',function(){
      console.log('file initiated');
    })


    scanProcess.stdout.on('data', function(data){
      fs.appendFile('./raw/img'+imageIndex+'.tiff', data, function(){
        console.log('worte chunk');
      })
    });

    scanProcess.stderr.on('data', function(data){
        console.log('' + data);
      })


    scanProcess.on('close', function(code,signal){
      console.log("scan done");

      var convertProcess =  spawn('convert', ['-quality','60', './raw/img'+imageIndex+'.tiff', './pictures/img'+imageIndex+'.jpg'])
              
      convertProcess.stderr.on('data', function(data){
        console.log('' + data);
      })

      convertProcess.on('close', function(code,signal){
        console.log("convert done");
        console.log(arguments)
        //scanned ended 
        clickNB++;

        cameraInUse = false;

      });
    });

		return true;
	}else{
		//cannot scan, it is already in use !
		return false;
	}


}
