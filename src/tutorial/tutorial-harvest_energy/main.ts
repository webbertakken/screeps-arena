import { getObjectsByPrototype } from 'game/utils'
import { Creep, Source, StructureSpawn } from 'game/prototypes'
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from 'game/constants'

export function loop() {
  const creep = getObjectsByPrototype(Creep).find((i) => i.my)
  const source = getObjectsByPrototype(Source)[0]
  const spawn = getObjectsByPrototype(StructureSpawn).find((i) => i.my)

  if (!creep) throw new Error('No creeps found')
  if (!source) throw new Error('No sources found')
  if (!spawn) throw new Error('No spawns found')

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  } else {
    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn)
    }
  }
}
