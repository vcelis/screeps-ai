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
    // Creep body array to create
    let body = [];
    for(let i = 0; i < numberOfParts; i++) {
      body.push(WORK);
      body.push(CARRY);
      body.push(MOVE);
    }
    // Memory cleanup
    for(let name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log("memory cleared");
      }
    }
    return this.spawnCreep(body, newName, {memory: {role: newRole}});
  };
