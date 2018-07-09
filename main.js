/**
 *  Import modules
 */
require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

module.exports.loop = function () {
  /**
   * Memory Cleanup
   */
   for(let name in Memory.creeps) {
     if(!Game.creeps[name]) {
       delete Memory.creeps[name];
     }
   }

  /**
   * Run designated functions for each creep
   */
  for(let name in Game.creeps) {
    Game.creeps[name].runRole();
  }

  /**
   * Tower management
   */
  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for(let tower of towers) {
    tower.defend();
    tower.repairStructure();
  }

  /**
   * Harvesters management
   */
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  if(harvesters.length < 3) {
    let newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCustomCreep(newName, 'harvester');
  }

  /**
   * Builders management
   */
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < 2) {
      var newName = 'Builder' + Game.time;
      Game.spawns['Spawn1'].spawnCustomCreep(newName, 'builder');
      //Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
    }

  /**
   * Repairers management
   */
  var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
  if(repairers.length < 0) {
    var newName = 'Repairer' + Game.time;
    Game.spawns['Spawn1'].spawnCustomCreep(newName, 'repairer');
    //Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'repairer'}});
  }

  /**
   * Upgraders management
   */
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  if(upgraders.length < 1) {
    var newName = 'Upgrader' + Game.time;
    Game.spawns['Spawn1'].spawnCustomCreep(newName, 'upgrader');
    //Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
  }

  Game.spawns['Spawn1'].spawnMiner();
}
