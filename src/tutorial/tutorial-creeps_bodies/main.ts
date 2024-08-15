import { Creep } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import { ATTACK, ERR_NOT_IN_RANGE, HEAL, RANGED_ATTACK } from 'game/constants'

export function loop() {
  const myCreeps = getObjectsByPrototype(Creep).filter((creep) => creep.my)
  const enemyCreep = getObjectsByPrototype(Creep).find((creep) => !creep.my)

  if (!enemyCreep) throw new Error('No enemy creeps found')

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
