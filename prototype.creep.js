/**
 *  Object to keep different roles.
 *  This way we can only load the one needed.
 */
var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer'),
  miner: require('role.miner')
};

/**
 *  Add runRole method to prototype to run designated role.
 */
Creep.prototype.runRole =
  function () {
    roles[this.memory.role].run(this);
  };

/**
 *  Add getEnergy method to prototype to order creep to get energy
 */
Creep.prototype.getEnergyOld =
  function () {
    let sources = this.room.find(FIND_SOURCES);
    sources = _.sortBy(sources, s => this.pos.getRangeTo(s));
    if(this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      this.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffff00', opacity: 0.2}});
    }
  };

Creep.prototype.getEnergy =
  function () {
    /** @type {StructureContainer} */
    let container;
    // find closest container
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                    s.store[RESOURCE_ENERGY] > 0
    });

    if (container) {
      // try to withdraw energy, if the container is not in range
      if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(container, {visualizePathStyle: {stroke: '#ffff00', opacity: 0.2}});
      }
    } else {
      var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (this.harvest(source) == ERR_NOT_IN_RANGE) {
        this.moveTo(source, {visualizePathStyle: {stroke: '#ffff00', opacity: 0.2}});
      }
    }
  };
