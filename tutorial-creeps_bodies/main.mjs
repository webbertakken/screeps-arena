import {} from 'game/utils'
import {} from 'game/prototypes'
import {} from 'game/constants'
import {} from 'arena'

import { getObjectsByPrototype } from 'game/utils'
import { Creep } from 'game/prototypes'
import { ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL } from 'game/constants'

export function loop() {
  const myCreeps = getObjectsByPrototype(Creep).filter((creep) => creep.my)
  const enemyCreep = getObjectsByPrototype(Creep).find((creep) => !creep.my)

  for (const creep of myCreeps) {
    if (creep.body.some((bodyPart) => bodyPart.type === ATTACK)) {
      if (creep.attack(enemyCreep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(enemyCreep)
      }
    }

    if (creep.body.some((bodyPart) => bodyPart.type === RANGED_ATTACK)) {
      if (creep.rangedAttack(enemyCreep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(enemyCreep)
      }
    }

    if (creep.body.some((bodyPart) => bodyPart.type === HEAL)) {
      const myDamagedCreeps = myCreeps.filter((i) => i.hits < i.hitsMax)
      if (myDamagedCreeps.length > 0) {
        if (creep.heal(myDamagedCreeps[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(myDamagedCreeps[0])
        }
      }
    }
  }
}
