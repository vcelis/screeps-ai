var roleMiner = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // Figure out what container to use
    let container = Game.getObjectById(creep.memory.containerId);

    // if creep is on top of the container
    if(creep.pos.isEqualTo(container.pos)) {
      creep.harvest(source);
    } else {
      creep.moveTo(container);
    }
  }
};

module.exports = roleMiner;
