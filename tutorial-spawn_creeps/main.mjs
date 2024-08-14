import { getObjectsByPrototype } from 'game/utils'
import { Flag, StructureSpawn } from 'game/prototypes'
import { ATTACK, MOVE } from 'game/constants'
import {} from 'arena'

let creeps = []
let currentFlag = 0

export function loop() {
  // Your code goes here

  const mySpawn = getObjectsByPrototype(StructureSpawn).filter((spawn) => spawn.my)[0]
  const flags = getObjectsByPrototype(Flag)

  if (creeps.length < flags.length) {
    const creep = mySpawn.spawnCreep([MOVE, ATTACK]).object
    creep.target = flags[currentFlag]
    currentFlag += 1
    creeps.push(creep)
  }

  for (const creep of creeps) {
    creep.moveTo(creep.target)
  }
}
