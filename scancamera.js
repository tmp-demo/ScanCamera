var express = require('express');
var fs = require('fs');
var cameralogic = require('./cameralogic');



var app = express()


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})


app.use(express.static('public'));
app.use(express.static('pictures'));
app.use(express.static('raw'));


// respond with "Hello World!" on the homepage
app.get('/', function (req, res) {
  res.send('Hello World!');
})


app.get('/preview/', function (req, res) {
  if(cameralogic.snap(cameralogic.definitions.uld)){
    res.send('starting scan at preview definition!');
    
  }else{
    res.send('cannot scan yet, the camera is already in use !');
    
  }

})

app.get('/snap/', function (req, res) {
  console.log('snap called');
  if(cameralogic.snap(cameralogic.definitions.sd, res)){
    console.log('starting scan at standard definition!');
    
  }else{
    res.send('cannot scan yet, the camera is already in use !');
    
  }
	

})

app.get('/snap/:definition', function (req, res) {
  console.log(req);
  console.log('snap called with definition');
  if(cameralogic.definitions[req.params.definition]){
    if( cameralogic.snap(cameralogic.definitions[req.params.definition], res) ) {
      //res.send('starting scan at specific definition!');
      console.log('starting scan at specific definition!');
      
    }else{
      res.send('cannot scan yet, the camera is already in use !');
      
    }
    
  }else{
    res.send('cannot scan, definition is unknown');
  }



})


app.get('/collection', function (req, res) {
  res.send('list of images!');

  //TODO : return here the list of the pictures already taken

})

app.get('/last.jpg', function (req, res, next) {
  console.log('acessing last picture');

  res.redirect(cameralogic.getLastPictureFilename());
;



  


})

app.get('/picture/:id', function (req, res) {
  res.send('the picture!');

  //TODO : return here the considered image

})

app.get('/raw/:id', function (req, res) {
  res.send('the raw picture!');

  //TODO : return here the considered image

})
