import { ATTACK, ERR_NOT_IN_RANGE, HEAL, RANGED_ATTACK, RESOURCE_ENERGY } from 'game/constants'
import { Room } from './Room'
import { Registry } from './Registry'
import { Worker } from './Worker'
import { Soldier } from './Soldier'
import { UnitData } from './UnitData'

Registry.init()

export function loop() {
  Registry.clear()

  const {
    mySpawn,
    myExtensions,
    workers,
    soldiers,
    enemyCreeps,
    sources,
    walls,
    containers,
    enemyStructures,
  } = Room.read()

  const myConstructionSites = Room.planConstructionSites(mySpawn)

  // Spawn
  if (workers.length < 1) {
    const initialTruck = UnitData.initialTruck(workers.length)
    const worker = mySpawn.spawnCreep(initialTruck.body).object as Worker | undefined
    if (worker) workers.push(Worker.create(worker, initialTruck))
  } else if (workers.length < 2) {
    const initialBuilder = UnitData.secondTruck(workers.length)
    const worker = mySpawn.spawnCreep(initialBuilder.body).object as Worker | undefined
    if (worker) workers.push(Worker.create(worker, initialBuilder))
  } else if (workers.length < 3) {
    const firstBuilder = UnitData.firstWorker(workers.length)
    const worker = mySpawn.spawnCreep(firstBuilder.body).object as Worker | undefined
    if (worker) workers.push(Worker.create(worker, firstBuilder))
  } else if (soldiers.length < 5) {
    const firstRanged = UnitData.firstRanged(soldiers.length)
    const soldier = mySpawn.spawnCreep(firstRanged.body).object as Soldier
    if (soldier) soldiers.push(Soldier.create(soldier, firstRanged))
  } else if (soldiers.length < 7) {
    const firstHealer = UnitData.firstHealer(soldiers.length)
    const soldier = mySpawn.spawnCreep(firstHealer.body).object as Soldier
    if (soldier) soldiers.push(Soldier.create(soldier, firstHealer))
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
  if (soldiers.length === 7) Registry.set('isArmyReady', true)
  const solider0IsAlive = soldiers[0] && soldiers[0].hits > 0
  const solider1IsAlive = soldiers[1] && soldiers[1].hits > 0

  for (const soldier of soldiers) {
    const closestEnemy = soldier.findClosestByRange(enemyCreeps)
    const closestWall = soldier.findClosestByRange(walls)
    const closestEnemyStructure = soldier.findClosestByRange(enemyStructures)

    if (!soldier.body) continue

    if (soldier.body.some((part) => part.type === ATTACK)) {
      if (Registry.get('isArmyReady')) {
        if (closestEnemy) {
          console.log('closest enemy', closestEnemy)
          if (soldier.attack(closestEnemy) === ERR_NOT_IN_RANGE) {
            if (soldier.data.index === 0 || soldier.data.index === 1) {
              soldier.moveTo(closestEnemy)
            } else {
              if (solider0IsAlive && solider1IsAlive) {
                soldier.moveTo(soldier.data.index % 2 === 0 ? soldiers[0] : soldiers[1])
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
            if (soldier.data.index === 0 || soldier.data.index === 1) {
              soldier.moveTo(closestEnemyStructure)
            } else {
              if (solider0IsAlive && solider1IsAlive) {
                soldier.moveTo(soldier.data.index % 2 === 0 ? soldiers[0] : soldiers[1])
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
        if (!Registry.get('isArmyReady')) {
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
        if (!Registry.get('isArmyReady')) {
          soldier.moveTo({ x: mySpawn.x + 2, y: mySpawn.y + 2 })
          continue
        }

        console.log('closestEnemyStructure', closestEnemyStructure)

        if (soldier.rangedAttack(closestEnemyStructure) === ERR_NOT_IN_RANGE) {
          if ([0, 1, 2, 3].includes(soldier.data.index)) {
            soldier.moveTo(closestEnemyStructure)
          } else {
            if (solider0IsAlive && solider1IsAlive) {
              soldier.moveTo(soldier.data.index % 2 === 0 ? soldiers[0] : soldiers[1])
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
