$( function() {
  var ref = new Firebase("https://tachikoma.firebaseio.com/datos");
  var loopFrases;
  var frasesRef = ref.child("frases");
  var humanosRef = ref.child("humanos");

  humanosRef.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $(document).bind('keydown', 'a', function assets() {
    console.log('a');
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
    }, 5000);
    $('#log').html(loopFrases);
    humanosRef.set({
      vivo:true
    });
    // $(document).unbind('keydown', 's', function(){
    //   console.log('unbind s');
    // });
    return false;
  });

  $(document).bind('keydown', 's', function assets() {
    $('#logs').html(loopFrases);
    clearInterval(loopFrases);
    console.log('s');
    humanosRef.set({
      vivo:false
    });
    // $(document).unbind('keydown', 'a', function(){
    //   console.log('unbind a');
    // });
    $(".wrap").css("border-width", "0px");
    $("#humanos").hide();
  });

  frasesRef.on("child_added", function(snapshot, prevChildKey) {
    var datos = snapshot.val();
    $('#sentencia').hide().html(datos.frase).fadeIn('slow');
  });

  var cuentaAtras = function(){
    // atras = setTimeout(function(){}, delay)
  }
  var anadirBorde = function(){
    $(".wrap").css("border-style", "dotted");
    $(".wrap").css("border-width", "2px");
    $(".wrap").css("border-color", "red");
    $('#humanos').hide().html('Human detect').fadeIn('slow');
  }

});