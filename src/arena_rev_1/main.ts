import { createConstructionSite, getObjectsByPrototype } from 'game/utils'
import {
  ConstructionSite,
  Creep,
  OwnedStructure,
  Source,
  StructureContainer,
  StructureExtension,
  StructureRampart,
  StructureSpawn,
  StructureTower,
  StructureWall,
} from 'game/prototypes'
import {
  ATTACK,
  ERR_NOT_IN_RANGE,
  HEAL,
  RANGED_ATTACK,
  CARRY,
  RESOURCE_ENERGY,
  WORK,
  MOVE,
  TOUGH,
} from 'game/constants'

const registry = {
  armyReady: false,
  initialConstruction: false,
}

type Worker = Creep & { index: number }
type Soldier = Creep & { index: number; hasMadeSpace: boolean }

export function loop() {
  const mySpawn = getObjectsByPrototype(StructureSpawn).filter((i) => i.my)[0]
  const myExtensions = getObjectsByPrototype(StructureExtension).filter((i) => i.my)
  const myCreeps = getObjectsByPrototype(Creep).filter((i) => i.my) || []
  const enemyCreeps = getObjectsByPrototype(Creep).filter((i) => !i.my)
  const sources = getObjectsByPrototype(Source)
  const walls = getObjectsByPrototype(StructureWall)
  const containers = getObjectsByPrototype(StructureContainer)
  const enemyStructures = getObjectsByPrototype(StructureTower).filter(
    (i) => !i.my,
  ) as OwnedStructure[]
  enemyStructures.push(...getObjectsByPrototype(StructureExtension).filter((i) => !i.my))
  enemyStructures.push(...getObjectsByPrototype(StructureSpawn).filter((i) => !i.my))
  // enemyStructures.push(...getObjectsByPrototype(StructureContainer).filter((i) => !i.my))
  enemyStructures.push(...getObjectsByPrototype(StructureRampart).filter((i) => !i.my))

  const myConstructionSites: ConstructionSite[] = []
  if (!registry.initialConstruction) {
    const extension = createConstructionSite<StructureExtension>(
      { x: mySpawn.x + 2, y: mySpawn.y + 2 },
      StructureExtension,
    )?.object

    const extension2 = createConstructionSite<StructureExtension>(
      { x: mySpawn.x - 2, y: mySpawn.y - 2 },
      StructureExtension,
    )?.object
    registry.initialConstruction = true
  }
  myConstructionSites.push(...getObjectsByPrototype(ConstructionSite).filter((i) => i.my))

  // Select creeps
  const { workers, soldiers } = myCreeps.reduce(
    (acc, creep) => {
      if (!creep) return acc
      if (creep.body.some((part) => part.type === CARRY)) {
        const worker = creep as Worker
        worker.index = acc.workers.length
        acc.workers.push(worker)
      } else {
        const soldier = creep as Soldier
        soldier.index = acc.soldiers.length
        soldier.hasMadeSpace = false
        acc.soldiers.push(soldier)
      }
      return acc
    },
    { workers: [], soldiers: [] } as { workers: Worker[]; soldiers: Soldier[] },
  )

  // Spawn
  if (workers.length < 3) {
    const worker = mySpawn.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK])
      .object as Worker
    if (worker) {
      worker.index = workers.length
      workers.push(worker)
    }
  } else if (soldiers.length < 5) {
    const soldier = mySpawn.spawnCreep([
      TOUGH,
      MOVE,
      MOVE,
      MOVE,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
    ]).object as Soldier
    if (soldier) {
      soldier.index = soldiers.length
      soldiers.push(soldier)
    }
  } else if (soldiers.length < 7) {
    const healer = mySpawn.spawnCreep([TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, HEAL])
      .object as Soldier
    if (healer) {
      healer.index = soldiers.length
      soldiers.push(healer)
    }
  }

  // Worker actions
  for (const worker of workers) {
    if (!worker) continue
    if (worker.spawning) continue

    if (worker.store.getFreeCapacity(RESOURCE_ENERGY)) {
      const closestContainer = worker.findClosestByRange(
        containers.filter((i) => i.store[RESOURCE_ENERGY] > 0),
      )
      const closestSource = worker.findClosestByRange(sources)

      if (closestContainer) {
        if (worker.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          worker.moveTo(closestContainer)
        }
      } else if (closestSource) {
        if (worker.harvest(closestSource) === ERR_NOT_IN_RANGE) {
          worker.moveTo(closestSource)
        }
      }
    } else {
      const closestNonFullExtension = worker.findClosestByRange(
        myExtensions.filter((i) => i.store.getFreeCapacity(RESOURCE_ENERGY)),
      )
      if (closestNonFullExtension) {
        console.log('is closest non full extension', closestNonFullExtension)
        if (worker.transfer(closestNonFullExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          worker.moveTo(closestNonFullExtension)
        }
      } else if (mySpawn.store.getFreeCapacity(RESOURCE_ENERGY)) {
        if (worker.transfer(mySpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          worker.moveTo(mySpawn)
        }
      } else if (myConstructionSites.length > 0) {
        console.log('is construction site', myConstructionSites[0])
        const buildResult = worker.build(myConstructionSites[0])
        console.log('build result', buildResult)
        if (buildResult === ERR_NOT_IN_RANGE) {
          worker.moveTo(myConstructionSites[0])
        }
      } else {
        if (worker.transfer(mySpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          worker.moveTo(mySpawn)
        }
      }
    }
  }

  // Army actions
  if (soldiers.length === 7) registry.armyReady = true
  const solider0IsAlive = soldiers[0] && soldiers[0].hits > 0
  const solider1IsAlive = soldiers[1] && soldiers[1].hits > 0

  for (const soldier of soldiers) {
    const closestEnemy = soldier.findClosestByRange(enemyCreeps)
    const closestWall = soldier.findClosestByRange(walls)
    const closestEnemyStructure = soldier.findClosestByRange(enemyStructures)

    if (!soldier.body) continue

    if (soldier.body.some((part) => part.type === ATTACK)) {
      if (registry.armyReady) {
        if (closestEnemy) {
          console.log('closest enemy', closestEnemy)
          if (soldier.attack(closestEnemy) === ERR_NOT_IN_RANGE) {
            if (soldier.index === 0 || soldier.index === 1) {
              soldier.moveTo(closestEnemy)
            } else {
              if (solider0IsAlive && solider1IsAlive) {
                soldier.moveTo(soldier.index % 2 === 0 ? soldiers[0] : soldiers[1])
              } else if (solider0IsAlive) {
                soldier.moveTo(soldiers[0])
              } else if (solider1IsAlive) {
                soldier.moveTo(soldiers[1])
              } else {
                soldier.moveTo(closestEnemy)
              }
            }
          }
        } else if (closestEnemyStructure) {
          console.log('closestEnemyStructure', closestEnemyStructure)

          if (soldier.attack(closestEnemyStructure) === ERR_NOT_IN_RANGE) {
            if (soldier.index === 0 || soldier.index === 1) {
              soldier.moveTo(closestEnemyStructure)
            } else {
              if (solider0IsAlive && solider1IsAlive) {
                soldier.moveTo(soldier.index % 2 === 0 ? soldiers[0] : soldiers[1])
              } else if (solider0IsAlive) {
                soldier.moveTo(soldiers[0])
              } else if (solider1IsAlive) {
                soldier.moveTo(soldiers[1])
              } else {
                soldier.moveTo(closestEnemyStructure)
              }
            }
          }
        } else {
          console.log('no closest Enemy structure')
        }
      }
    }

    if (soldier.body.some((part) => part.type === RANGED_ATTACK)) {
      if (closestEnemy) {
        console.log('closest enemy', closestEnemy)
        if (!registry.armyReady) {
          soldier.rangedAttack(closestEnemy)
          soldier.moveTo({ x: mySpawn.x + 2, y: mySpawn.y + 2 })
          continue
        }

        if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
          soldier.moveTo(closestEnemy)
          if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
            if (closestWall) soldier.rangedAttack(closestWall)
          }
        } else {
          soldier.moveTo({ x: -(soldier.x - closestEnemy.x), y: -(soldier.y - closestEnemy.y) })
        }
      } else if (closestEnemyStructure) {
        if (!registry.armyReady) {
          soldier.moveTo({ x: mySpawn.x + 2, y: mySpawn.y + 2 })
          continue
        }

        console.log('closestEnemyStructure', closestEnemyStructure)

        if (soldier.rangedAttack(closestEnemyStructure) === ERR_NOT_IN_RANGE) {
          if ([0, 1, 2, 3].includes(soldier.index)) {
            soldier.moveTo(closestEnemyStructure)
          } else {
            if (solider0IsAlive && solider1IsAlive) {
              soldier.moveTo(soldier.index % 2 === 0 ? soldiers[0] : soldiers[1])
            } else if (solider0IsAlive) {
              soldier.moveTo(soldiers[0])
            } else if (solider1IsAlive) {
              soldier.moveTo(soldiers[1])
            } else {
              soldier.moveTo(closestEnemyStructure)
            }
          }
        }
      } else {
        console.log('no closest Enemy or structure')
      }
    }

    if (soldier.body.some((part) => part.type === HEAL)) {
      const myDamagedCreeps = soldiers.filter((i) => i.hits < i.hitsMax)
      if (myDamagedCreeps.length > 0) {
        if (soldier.heal(myDamagedCreeps[0]) === ERR_NOT_IN_RANGE) {
          soldier.moveTo(myDamagedCreeps[0])
        }
      } else {
        soldier.moveTo(soldiers[0])
      }
    }
  }
}
