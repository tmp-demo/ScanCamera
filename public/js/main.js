//here goes the logic for scanning



window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://192.168.10.1:3000/');
    var snapButton = document.getElementById("snap");
    var content = document.getElementById("content");
    var status = document.getElementById("status");
 
    socket.on('status', function (data) {
        if(!data.status) {
          console.log("There is a problem:", data);
        } else {
          var html = '';
          //test for the different values of status
          if(data.status == "connected"){
            status.innerHTML = "Connection established";
          }else if(data.status == "progress"){
            status.innerHTML = "Progress : " + data.progress;
            if( data.imagedata ){
              console.log("received imagedata " , data.imagedata);
              //document.getElementById('display').setAttribute('src','data:image/jpeg;base64,'+data.imagedata);
              jQuery("#content").append(
                jQuery("img").attr({src:'data:image/jpeg;base64,'+data.imagedata})
              );
            }
          }else if(data.status == "initializing"){
            console.log("scan initialized");
            status.innerHTML = "Scan initialized";
          }else if(data.status == "done"){
            console.log("scan terminated");
            status.innerHTML = "Connection established";
          }else if(data.status == "fail"){
            alert("something went wrong : \r\n " + data.message);
          }            
        }
    });

    socket.on('image', function(data){
      //the image should be in the data.
      //just put the image in the img tag
      console.log("obtained a new version of the image");
    });
 
    snapButton.onclick = function() {
        socket.emit('snap', { });
    };

  }

function startScan(){
  console.log("start scan");

  //cal ajax function to start it
  $.get( "./snap", function( data ) {
    $( ".result" ).html( data );
    alert( "Load was performed." );
  });

}
