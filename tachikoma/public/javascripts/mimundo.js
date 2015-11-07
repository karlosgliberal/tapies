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