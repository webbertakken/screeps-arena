import { getObjectsByPrototype } from 'game/utils'
import { Creep, StructureContainer, StructureTower } from 'game/prototypes'
import { RESOURCE_ENERGY } from 'game/constants'

export function loop() {
  const tower = getObjectsByPrototype(StructureTower)[0]

  if (tower.store[RESOURCE_ENERGY] < 10) {
    const myCreep = getObjectsByPrototype(Creep).find((creep) => creep.my)

    if (!myCreep) throw new Error('No creeps found')

    if (myCreep.store[RESOURCE_ENERGY] === 0) {
      const container = getObjectsByPrototype(StructureContainer)[0]
      myCreep.withdraw(container, RESOURCE_ENERGY)
    } else {
      myCreep.transfer(tower, RESOURCE_ENERGY)
    }
  } else {
    const target = getObjectsByPrototype(Creep).find((creep) => !creep.my)
    if (target) tower.attack(target)
  }
}
