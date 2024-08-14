import { prototypes, utils, constants } from 'game'

export function loop() {
  const creep = utils.getObjectsByPrototype(prototypes.Creep).find((i) => i.my)
  const source = utils.getObjectsByPrototype(prototypes.Source)[0]
  const spawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).find((i) => i.my)

  if (creep.store.getFreeCapacity(constants.RESOURCE_ENERGY)) {
    if (creep.harvest(source) === constants.ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  } else {
    if (creep.transfer(spawn, constants.RESOURCE_ENERGY) === constants.ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn)
    }
  }
}
