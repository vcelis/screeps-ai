/**
 *  Add defend method to StructureTower object for defence strategies
 */
StructureTower.prototype.defend =
  function () {
    let closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      this.attack(closestHostile);
    }
  };

/**
*  Add repair method to StructureTower object for repair strategies
*/
StructureTower.prototype.repairStructure =
  function () {
    let closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.hits < structure.hitsMax) &&
                             (structure.structureType != STRUCTURE_WALL)
    });
    if(closestDamagedStructure) {
      this.repair(closestDamagedStructure);
    }
  };
