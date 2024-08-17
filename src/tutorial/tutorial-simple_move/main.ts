import { getObjectsByPrototype } from 'game/utils'
import { Creep } from 'game/prototypes'
import { Flag } from 'arena/prototypes'

export function loop() {
  const creeps = getObjectsByPrototype(Creep)
  const flags = getObjectsByPrototype(Flag)

  creeps.map((creep) => {
    creep.moveTo(flags[0])
  })
}
