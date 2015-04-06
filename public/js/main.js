//here goes the logic for scanning


function startScan(){
  console.log("start scan");

  //cal ajax function to start it
  $.get( "./snap", function( data ) {
    $( ".result" ).html( data );
    alert( "Load was performed." );
  });

}
