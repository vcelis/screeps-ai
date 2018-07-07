/**
 *  Import modules
 */
require('prototype.creep');
require('prototype.spawn');

module.exports.loop = function () {
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
    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.hits < structure.hitsMax) &&
                             (structure.structureType != STRUCTURE_WALL)
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
  }

  /**
   * Harvesters management
   */
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  if(harvesters.length < 4) {
    let newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCustomCreep(newName, 'harvester');
  }

  /**
   * Builders management
   */
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < 1) {
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
  if(upgraders.length < 3) {
    var newName = 'Upgrader' + Game.time;
    Game.spawns['Spawn1'].spawnCustomCreep(newName, 'upgrader');
    //Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
  }

  Game.spawns['Spawn1'].spawnMiner();

  /**
   * Visual spawn text
   */
   /**
  if(Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      {align: 'left', opacity: 0.8});
  }
  **/
}
