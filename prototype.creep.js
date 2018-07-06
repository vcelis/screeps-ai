/**
 *  Object to keep different roles.
 *  This way we can only load the one needed.
 */
var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer')
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
Creep.prototype.getEnergy =
  function () {
    let sources = this.room.find(FIND_SOURCES);
    sources = _.sortBy(sources, s => this.pos.getRangeTo(s));
    if(this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      this.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffff00', opacity: 0.2}});
    }
  };
