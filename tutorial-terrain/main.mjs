import { getObjectsByPrototype } from 'game/utils'
import { Creep, Flag } from 'game/prototypes'
import {} from 'game/constants'
import {} from 'arena'

export function loop() {
  // Your code goes here

  const creeps = getObjectsByPrototype(Creep).filter((creep) => creep.my)
  const flags = getObjectsByPrototype(Flag)

  for (const creep of creeps) {
    const closestFlag = creep.findClosestByPath(flags)
    creep.moveTo(closestFlag)
  }
}
