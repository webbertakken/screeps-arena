import { RESOURCE_ENERGY, ERR_NOT_IN_RANGE } from 'game/constants'
import { ConstructionSite, Creep, StructureContainer, StructureTower } from 'game/prototypes'
import { createConstructionSite, findClosestByPath, getObjectsByPrototype } from 'game/utils'

export function loop() {
  const creep = getObjectsByPrototype(Creep).find((i) => i.my)

  if (!creep) throw new Error('No creeps found')

  if (!creep.store[RESOURCE_ENERGY]) {
    const container = findClosestByPath(creep, getObjectsByPrototype(StructureContainer))
    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(container)
    }
  } else {
    const constructionSite = getObjectsByPrototype(ConstructionSite).find((i) => i.my)
    if (!constructionSite) {
      createConstructionSite({ x: 50, y: 55 }, StructureTower)
    } else {
      if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite)
      }
    }
  }
}
