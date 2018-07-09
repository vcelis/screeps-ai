var roleUpgrader = require('role.upgrader');

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        // Sort to select closest target
        targets = _.sortBy(targets, s => creep.pos.getRangeTo(s));
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          //creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          creep.moveTo(targets[0]);
        }
      }
      else {
        roleUpgrader.run(creep);
      }
    }
    else {
      creep.getEnergy();
    }
  }
};

module.exports = roleBuilder;
