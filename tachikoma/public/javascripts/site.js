$( function() {
  var ref = new Firebase("https://tachikoma.firebaseio.com/datos");
  var loopFrases;
  var frasesRef = ref.child("frases");
  var humanosRef = ref.child("humanos");
  var estanVivos;
 
  var miMundo = new Submundo();
  miMundo.registerCreature(criaturas.plant);
  miMundo.registerCreature(criaturas.brute);
  miMundo.registerCreature(criaturas.bully);
  miMundo.grid([['plant', 50], ['brute', 5], ['bully', 5]]);
  miMundo.action('animate');

  var miCara = new Caras();
  var detectarCaras = miCara.detectFaces();

  console.log(detectarCaras);

  humanosRef.on("value", function(snapshot) {
    estanVivos = snapshot.val();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
 $('.human').hide();
 var humanosVivos = function(frase){
    //$('canvas').remove();
    miMundo.action('pause');
    // criaturas.plant.color = [242, 50, 66]
    // criaturas.plant.type = 'sangre';
    // var humanMundo = new Submundo();
    // humanMundo.registerCreature(criaturas.plant);
    // humanMundo.registerCreature(criaturas.brute);
    // humanMundo.registerCreature(criaturas.bully);
    // humanMundo.grid([['sangre', 50], ['brute', 5], ['bully', 5]]);
    // humanMundo.action('animate');

    $('#sentencia').hide().html(frase.frase).fadeIn('slow');
    $('.human').fadeIn();
  }

  var humanosMuerto = function(){
    //$('canvas').remove();
    criaturas.plant.color = [242, 50, 66]
    criaturas.plant.type = 'plant';
    var humanMundo = new Submundo();
    humanMundo.registerCreature(criaturas.plant);
    humanMundo.registerCreature(criaturas.brute);
    humanMundo.registerCreature(criaturas.bully);
    humanMundo.grid([['plant', 50], ['brute', 5], ['bully', 5]]);
    humanMundo.action('animate');
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