import { getObjectsByPrototype } from 'game/utils'
import { Creep } from 'game/prototypes'
import { Flag } from 'arena/prototypes'

export function loop() {
  // Your code goes here

  const creeps = getObjectsByPrototype(Creep).filter((creep) => creep.my)
  const flags = getObjectsByPrototype(Flag)

  for (const creep of creeps) {
    const closestFlag = creep.findClosestByPath(flags)
    if (closestFlag) creep.moveTo(closestFlag)
  }
}
