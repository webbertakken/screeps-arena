import { getObjectsByPrototype } from 'game/utils'
import { Creep, Source, StructureRampart, StructureSpawn, StructureWall } from 'game/prototypes'
import {
  ATTACK,
  ERR_NOT_IN_RANGE,
  HEAL,
  RANGED_ATTACK,
  CARRY,
  RESOURCE_ENERGY,
  WORK,
  MOVE,
} from 'game/constants'

export function loop() {
  const mySpawn = getObjectsByPrototype(StructureSpawn).filter((i) => i.my)[0]
  const myCreeps = getObjectsByPrototype(Creep).filter((i) => i.my)
  const enemyCreeps = getObjectsByPrototype(Creep).filter((i) => !i.my)
  const source = getObjectsByPrototype(Source)[0]
  const walls = getObjectsByPrototype(StructureWall)

  const { workers, army } = myCreeps.reduce(
    (acc, creep) => {
      if (creep.body.some((part) => part.type === CARRY)) {
        acc.workers.push(creep)
      } else {
        acc.army.push(creep)
      }
      return acc
    },
    { workers: [], army: [] } as { workers: Creep[]; army: Creep[] },
  )

  if (workers.length < 2) {
    const worker = mySpawn.spawnCreep([MOVE, CARRY, WORK]).object
    if (worker) workers.push(worker)
  } else if (army.length < 6) {
    const soldier = mySpawn.spawnCreep([MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK]).object
    if (soldier) army.push(soldier)
  }

  for (const worker of workers) {
    if (worker.store.getFreeCapacity(RESOURCE_ENERGY)) {
      if (worker.harvest(source) === ERR_NOT_IN_RANGE) {
        worker.moveTo(source)
      }
    } else {
      if (worker.transfer(mySpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        worker.moveTo(mySpawn)
      }
    }
  }

  for (const soldier of army) {
    const closestEnemy = soldier.findClosestByRange(enemyCreeps)
    const closestWall = soldier.findClosestByRange(walls)
    // solder.lastPositions || []

    if (soldier.body.some((part) => part.type === ATTACK)) {
      if (!closestEnemy) continue
      if (soldier.attack(closestEnemy) === ERR_NOT_IN_RANGE) {
        soldier.moveTo(closestEnemy)
      }
    }

    if (soldier.body.some((part) => part.type === RANGED_ATTACK)) {
      if (!closestEnemy) continue
      if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
        soldier.moveTo(closestEnemy)
        if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
          if (closestWall) soldier.rangedAttack(closestWall)
        }
      } else {
        soldier.moveTo({ x: -(soldier.x - closestEnemy.x), y: -(soldier.y - closestEnemy.y) })
      }
    }

    if (soldier.body.some((part) => part.type === HEAL)) {
      const myDamagedCreeps = army.filter((i) => i.hits < i.hitsMax)
      if (myDamagedCreeps.length > 0) {
        if (soldier.heal(myDamagedCreeps[0]) === ERR_NOT_IN_RANGE) {
          soldier.moveTo(myDamagedCreeps[0])
        }
      }
    }
  }
}
