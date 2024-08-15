import { getObjectsByPrototype } from 'game/utils'
import { Creep, GameObject, StructureSpawn } from 'game/prototypes'
import { Flag } from 'arena/prototypes'
import { ATTACK, MOVE } from 'game/constants'

interface CreepWithTarget extends Creep {
  target: GameObject
}

const creeps: CreepWithTarget[] = []
let currentFlag = 0

export function loop() {
  // Your code goes here

  const mySpawn = getObjectsByPrototype(StructureSpawn).filter((spawn) => spawn.my)[0]
  const flags = getObjectsByPrototype(Flag)

  if (creeps.length < flags.length) {
    const creep = mySpawn.spawnCreep([MOVE, ATTACK]).object as CreepWithTarget
    if (!creep) throw new Error('Failed to spawn a creep')

    creep.target = flags[currentFlag]
    currentFlag += 1
    creeps.push(creep)
  }

  for (const creep of creeps) {
    creep.moveTo(creep.target)
  }
}
