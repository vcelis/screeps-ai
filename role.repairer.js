var roleBuilder = require('role.builder');

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    this.getNextTarget(creep);
    if(creep.memory.building) {
      roleBuilder.run(creep);
      return;
    }

    // If energy empty, reset memory variables and get energy
    if(creep.carry.energy == 0 || (!creep.memory.repairing && (creep.carry.energy < creep.carryCapacity))) {
      creep.memory.repairing = false;
      delete creep.memory.repairTarget;
      creep.getEnergy();
    }
    // If we are not repairing and done filling up on energy, toggle repairing and get target
    if(!creep.memory.repairing && (creep.carry.energy == creep.carryCapacity)) {
      creep.memory.repairing = true;
      creep.memory.repairTarget = this.getNextTarget(creep);
    }

    if(creep.memory.repairing) {
      // If nothing left to repair on target, get new target
      if(!this.checkRepairTarget(creep)) {
        creep.memory.repairTarget = this.getNextTarget(creep);
      }
      // Check if there is any structure left to repair, if not, go build.
      if(creep.memory.repairTarget) {
        this.tryToRepair(creep);
      } else {
        creep.memory.repairing = false;
        delete creep.memory.repairTarget;
        roleBuilder.run(creep);
      }
    }
  },

  /** @param {Creep} creep **/
  getNextTarget: function(creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
      //filter: object => (object.hits < (object.hitsMax*0.9)) && (object.structureType != STRUCTURE_WALL)
      filter: object => (object.hits < (object.hitsMax*0.9)) &&
                        (object.structureType != STRUCTURE_WALL) &&
                        (creep.pos.getRangeTo(object.pos) < 10)
    });
    // If there are no targets to repair within 10 distance
    if(!targets[0]) {
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => (object.hits < (object.hitsMax*0.9)) && (object.structureType != STRUCTURE_WALL)
      });
    }
    targets.sort((a,b) => a.hits - b.hits);
    return (targets[0] ? targets[0].id : undefined);
  },

  /** @param {Creep} creep **/
  tryToRepair: function(creep) {
    let repair = creep.repair(Game.getObjectById(creep.memory.repairTarget));
    if(repair == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.getObjectById(creep.memory.repairTarget), {visualizePathStyle: {stroke: '#0000ff', opacity: 0.2}});
    }
  },

  /** @param {Creep} creep **/
  checkRepairTarget: function(creep) {
    let damage;
    if(creep.memory.repairTarget) {
      damage = Game.getObjectById(creep.memory.repairTarget).hitsMax - Game.getObjectById(creep.memory.repairTarget).hits;
    }
    return (damage ? true : false);
  }

};

module.exports = roleRepairer;
