$( function() {
  var ref = new Firebase("https://tachikoma.firebaseio.com/datos");
  var loopFrases;
  var frasesRef = ref.child("frases");
  var humanosRef = ref.child("humanos");
  var estanVivos;
  window.terra;
  var width = $(window).width() / 10;
  var criaturas = {};

  criaturas.plant = {
    type: 'plant',
    color: [173, 173, 173],
    size: 10,
    initialEnergy: 5,
    maxEnergy: 20,
    wait: function() {
      // photosynthesis :)
      this.energy += 2;
    },
    move: false,
    reproduceLv: 0.65
  };

  criaturas.brute = {
    type: 'brute',
    color: [29, 30, 25],
    maxEnergy: 50,
    initialEnergy: 2,
    size: 20
  };

  criaturas.bully = {
    type: 'bully',
    color: [147, 112, 219],
    initialEnergy: 20,
    reproduceLv: 0.6,
    sustainability: 3
  };

  var Submundo = function(){
    this.terra = window.terra;
    this.bbTerrarium = new terra.Terrarium(width, 5, {id:'terra'});
  };

  Submundo.prototype.registerCreature = function(obj){
    this.terra.registerCreature(obj);
  };

  Submundo.prototype.grid = function(array){
    this.bbTerrarium.grid = this.bbTerrarium.makeGridWithDistribution(array);
  };

  Submundo.prototype.action = function(act){
    if(act == 'animate'){
      this.bbTerrarium.animate(5000);
    } else if(act == 'stop'){
      this.bbTerrarium.stop();
    } else if(act == 'destroy'){
      this.bbTerrarium.destroy();
    }
  };

  var miMundo = new Submundo();
  miMundo.registerCreature(criaturas.plant);
  miMundo.registerCreature(criaturas.brute);
  miMundo.registerCreature(criaturas.bully);
  miMundo.grid([['plant', 50], ['brute', 5], ['bully', 5]]);
  miMundo.action('animate');


  humanosRef.on("value", function(snapshot) {
    estanVivos = snapshot.val();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  $('.human').hide();
  $(document).bind('keydown', 'a', function assets() {
    loopFrases = setInterval(function(){
      $.get( "/sentencia", function( data ) {
        frasesRef.child(Date.now()).set({
          frase: data.sentences
        });
      });
    }, 9000);
    humanosRef.set({
      vivo:true
    });
    return false;
  });

  $(document).bind('keydown', 's', function assets() {
    clearInterval(loopFrases);
    humanosRef.set({
      vivo:false
    });
  });

  var humanosVivos = function(frase){
    $('canvas').remove();
    criaturas.plant.color = [242, 50, 66]
    criaturas.plant.type = 'sangre';
    var humanMundo = new Submundo();
    humanMundo.registerCreature(criaturas.plant);
    humanMundo.registerCreature(criaturas.brute);
    humanMundo.registerCreature(criaturas.bully);
    humanMundo.grid([['sangre', 50], ['brute', 5], ['bully', 5]]);
    humanMundo.action('animate');

    $('#sentencia').hide().html(frase.frase).fadeIn('slow');
    $('.human').fadeIn();
  }

  var humanosMuerto = function(){
    $('canvas').remove();
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