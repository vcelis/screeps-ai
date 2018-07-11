//var roleUpgrader = require('role.upgrader');

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    /**
    if(creep.memory.upgrading) {
      roleUpgrader.run(creep);
      return;
    }**/

    // If energy empty, reset memory variables and get energy
    if(creep.carry.energy == 0 || (!creep.memory.harvesting && (creep.carry.energy < creep.carryCapacity))) {
      creep.memory.harvesting = false;
      delete creep.memory.transferTarget;
      creep.getEnergy();
    }
    // If we are not filling a storage and done filling up on energy, toggle harvesting and get target
    if(!creep.memory.harvesting && (creep.carry.energy == creep.carryCapacity)) {
      creep.memory.harvesting = true;
      creep.memory.transferTarget = this.getNextTarget(creep);
    }

    if(creep.memory.harvesting) {
      // If nothing left to transfer on target, get new target
      if(!this.checkTransferTarget(creep)) {
        creep.memory.transferTarget = this.getNextTarget(creep);
      }
      // Check if there is any structure left to transfer, if not, go upgrading.
      if(creep.memory.transferTarget) {
        this.tryToTransfer(creep);
      } else {
        //roleUpgrader.run(creep);
        let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: s => (s.structureType == STRUCTURE_STORAGE &&
                        s.store[RESOURCE_ENERGY] < s.storeCapacity)
        });
        if(storage) {
          creep.memory.transferTarget = storage.id;
          let transfer = creep.transfer(Game.getObjectById(creep.memory.transferTarget), RESOURCE_ENERGY);
          if(transfer == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.transferTarget), {visualizePathStyle: {stroke: '#00ff00', opacity: 0.2}});
          }
          //this.tryToTransfer(creep);
        }
      }
    }
  },

  /** @param {Creep} creep **/
  getNextTarget: function(creep) {
    let emptyTowers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER &&
                structure.energy < (structure.energyCapacity*0.5))
      }
    });
    if(emptyTowers[0]) {
      return emptyTowers[0].id;
    }

    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER )
                && structure.energy < structure.energyCapacity;
      }
    });
    // Sort to select closest target
    targets = _.sortBy(targets, s => creep.pos.getRangeTo(s));
    //console.log(JSON.stringify(targets[0]));
    return (targets[0] ? targets[0].id : undefined);
  },

  /** @param {Creep} creep **/
  tryToTransfer: function(creep) {
    let transfer = creep.transfer(Game.getObjectById(creep.memory.transferTarget), RESOURCE_ENERGY);
    if(transfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.getObjectById(creep.memory.transferTarget), {visualizePathStyle: {stroke: '#00ff00', opacity: 0.2}});
    }
  },

  /** @param {Creep} creep **/
  checkTransferTarget: function(creep) {
    let shortage;
    if(creep.memory.transferTarget) {
      //console.log(JSON.stringify(creep.memory));
      shortage = Game.getObjectById(creep.memory.transferTarget).energyCapacity - Game.getObjectById(creep.memory.transferTarget).energy;
    }
    return (shortage ? true : false);
  }

};

module.exports = roleHarvester;
