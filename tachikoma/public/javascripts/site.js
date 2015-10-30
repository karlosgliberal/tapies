$( function() {
  var ref = new Firebase("https://tachikoma.firebaseio.com/datos");
  var loopFrases;
  var frasesRef = ref.child("frases");
  var humanosRef = ref.child("humanos");
  var estanVivos;

  humanosRef.on("value", function(snapshot) {
    estanVivos = snapshot.val();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  humanosRef.set({
    vivo:false
  });

  $(document).bind('keydown', 'a', function assets() {
    $(".wrap").css("border-style", "dotted");
    $(".wrap").css("border-width", "2px");
    $(".wrap").css("border-color", "red");
    $('#humanos').hide().html('<h1 style="color:red;width:50px;">Human Detect</h1>').fadeIn('slow');
    loopFrases = setInterval(function(){
      $.get( "/sentencia", function( data ) {
        frasesRef.child(Date.now()).set({
          frase: data.sentences
        });
      });
    }, 2000);
    $('#log').html(loopFrases);
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
    $(".wrap").css("border-style", "dotted");
    $(".wrap").css("border-width", "2px");
    $(".wrap").css("border-color", "red");
    $('#sentencia').hide().html(frase.frase).fadeIn('slow');
    $('#humanos').hide().html('<h1 style="color:red;width:50px;">Human Detect</h1>').fadeIn('slow');
  }

  var humanosMuerto = function(){
    $(".wrap").css("border-style", "dotted");
    $(".wrap").css("border-width", "0px");
    $(".wrap").css("border-color", "red");
    $('#humanos').hide().html('').fadeIn('slow');
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