/**
 *  Array to keep list of different roles.
 */
var roles = ['harvester', 'upgrader', 'builder', 'repairer'];

/**
 *  Add createCreep method to prototype add biggest balanced creep as possible
 */

StructureSpawn.prototype.spawnCustomCreep =
  function (newName, newRole) {
    // Create a balanced creep with as much pieces each.
    let numberOfParts = Math.floor(this.room.energyCapacityAvailable/200);
    // Creep has maximum 50 parts.
    numberOfParts = Math.min(numberOfParts, Math.floor(50/3));
    numberOfParts = numberOfParts > 3 ? 3 : numberOfParts;
    // Creep body array to create
    let body = [];
    for(let i = 0; i < numberOfParts; i++) {
      body.push(WORK);
      body.push(CARRY);
      body.push(MOVE);
    }
    return this.spawnCreep(body, newName, {memory: {role: newRole}});
  };

StructureSpawn.prototype.spawnMiner =
  function () {
    // Make an array of containerIds currently in use by miners
    let containersInUse = [];
    for(let name in Memory.creeps) {
      if(Memory.creeps[name].role == 'miner') {
        containersInUse.push(Memory.creeps[name].containerId);
      }
    }
    // Make an array of total containerId`s
    let containers = [];
    let containerStructures = this.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType == STRUCTURE_CONTAINER
    });
    for(let container in containerStructures) {
      containers.push(containerStructures[container].id);
    }
    // Get an array of unused containers
    let containersFree = containers.filter(function(i) {return containersInUse.indexOf(i) < 0;});

    if(containersFree.length > 0) {
      // Fabricate body
      let numberOfParts = Math.floor((this.room.energyCapacityAvailable-100)/100);
      numberOfParts = Math.min(numberOfParts, Math.floor(50/3));
      numberOfParts = numberOfParts > 5 ? 5 : numberOfParts;
      let body = [];
      body.push(CARRY);
      for(let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      body.push(MOVE);
      let newName = 'Miner' + Game.time;
      return this.spawnCreep(body, newName, {memory: {role: 'miner', containerId: containersFree[0]}});
    }
  };
