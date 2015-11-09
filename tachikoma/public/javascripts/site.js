$( function() {
  window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);
  navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  var ref = new Firebase("https://tachikoma.firebaseio.com/datos");
  mandrill_client = new mandrill.Mandrill('jKVpYZGaJISrpyC23Uj4RQ');
  var loopFrases;
  var frasesRef = ref.child("frases");
  var humanosRef = ref.child("humanos");
  var contadorRef = ref.child("contador");
  var contador = 0;
  var estanVivos;
  var contar = {};
  contar.cuenta = 0;

  var Caras = function(){
  video = document.createElement('video'),
  canvas = document.querySelector('#video'),
  context = canvas.getContext('2d');

  var originalFace,
  SCALE_EXPERIMENT = 'scale',
  experimentType = SCALE_EXPERIMENT,
  gUMOptions = {video: true, toString: function(){ return "video"; }};
  video.setAttribute('autoplay', true);
  context.fillStyle = "rgba(0, 0, 200, 0.5)";

var mandarCorreo = function(){
    var message = {
        "html": "hola caracola",
        "subject": "Basoasuites.com",
        "from_email": "karlosgliberal@gmail.com",
        "from_name": "basoasuites.com",
        "to": [{
                "email": "karlosgliberal@gmail.com",
                "name": "Recipient Name",
                "type": "to"
            }
            ],
        "headers": {
            "Reply-To": "karlosgliberal@gmail.com"
        }
    };
    mandrill_client.messages.send({"message": message}, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
}


  if (typeof navigator.getUserMedia === "function") {
    navigator.getUserMedia(gUMOptions, handleWebcamStream, errorStartingStream);
  }

  function handleWebcamStream(stream) {
      this.video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
      processWebcamVideo();
  }

  function errorStartingStream() {
    alert('Uh-oh, the webcam didn\'t start. Do you have a webcam? Did you give it permission? Refresh to try again.');
  }

  function processWebcamVideo() {
    var changed = false,
        scaleFactor = 1,
        faces;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      faces = detectFaces();
      if(faces.length == 0){
        $('.human').fadeOut();
        humanosRef.set({
          vivo:false
        });
      }
      highlightFaces(faces);
     if( ! originalFace && faces.length === 1) {
         originalFace = faces[0];
     }
     setTimeout(processWebcamVideo, 70);
  }
  this.canvas = canvas;
  function detectFaces() {
    return ccv.detect_objects({canvas : (ccv.pre(canvas)), cascade: cascade, interval: 2, min_neighbors: 1});
  }

  // Draw found faces onto the canvas
  function highlightFaces(faces) {
      if(!faces) {
        return false;
      } else {
        for (var i = 0; i < faces.length; i++) {
          var face = faces[i];

          if(face.width >= 30 && contador == 60){
            $.get( "/sentencia", function( data ) {
              frasesRef.child(Date.now()).set({
                frase: data.sentences
              });
            });
            contadorRef.on("value", function(snapshot) {
              var contar = snapshot.val();
              if(contar.cuenta >= 10){
                console.log('hola cuenta');
                //mandarCorreo();
                contadorRef.set({
                  cuenta:0
                });
              }
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
            contadorRef.set({
              cuenta:contar.cuenta++
            });
            humanosRef.set({
              vivo:true
            });
            contador = 0;
          } else {
            console.log(contador);
            contador++;
          }
          $('.human').fadeIn();
          context.fillRect(face.x, face.y, face.width, face.height);
        }
      }
  }

}



  // var miMundo = new Submundo();
  // miMundo.registerCreature(criaturas.plant);
  // miMundo.registerCreature(criaturas.brute);
  // miMundo.registerCreature(criaturas.bully);
  // miMundo.grid([['plant', 50], ['brute', 5], ['bully', 5]]);
  // miMundo.action('animate');

  var miCara = new Caras();

  humanosRef.on("value", function(snapshot) {
    estanVivos = snapshot.val();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $('.human').hide();
  var humanosVivos = function(frase){
    //miMundo.action('stop');
    $('#sentencia').hide().html(frase.frase).fadeIn('slow');
    $('.human').fadeIn();
  }

  var humanosMuerto = function(){
    //miMundo.action('animate');
    $('.human').fadeOut();
  }

  frasesRef.on("child_added", function(snapshot, prevChildKey){
    if(estanVivos.vivo == true){
      var frase = snapshot.val();
      humanosVivos(frase);
    }
  });

  humanosRef.on("child_changed", function(snapshot, prevChildKey){
    var estado = snapshot.val();
    if(estado == false){
      humanosMuerto();
    }
  });


});