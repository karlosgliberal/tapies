// Normalize getUserMedia and URL
// https://gist.github.com/f2ac64ed7fc467ccdfe3

//normalize window.URL
window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);

//normalize navigator.getUserMedia
navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var ref = new Firebase("https://tachikoma.firebaseio.com/datos");
var frasesRef = ref.child("frases");
var humanosRef = ref.child("humanos");
var contador = 0;

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
    var startTime = +new Date(),
        changed = false,
        scaleFactor = 1,
        faces;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      faces = detectFaces();
      if(faces.length == 0){
        humanosRef.set({
          vivo:false
        });
      }
      highlightFaces(faces);
     if( ! originalFace && faces.length === 1) {
         originalFace = faces[0];
     }
     setTimeout(processWebcamVideo, 4000);
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

          if(face.width >= 40 && contador == 0){
            $.get( "/sentencia", function( data ) {
              frasesRef.child(Date.now()).set({
                frase: data.sentences
              });
            });
            humanosRef.set({
              vivo:true
            });
          }
          context.fillRect(face.x, face.y, face.width, face.height);
        }
      }
  }

}

Caras.prototype.detectFaces = function(argument){
  var canvas = this.canvas;
  return ccv.detect_objects({canvas : (ccv.pre(canvas)), cascade: cascade, interval: 2, min_neighbors: 1});
};

