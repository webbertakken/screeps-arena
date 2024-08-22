import { useMemory } from '../../lib'
import { ATTACK, ERR_NOT_IN_RANGE, RANGED_ATTACK } from 'game/constants'
import { X } from '../X'

export class Commander {
  static instructSoldiers() {
    const [getIsArmyReady, setIsArmyReady] = useMemory<boolean>('isArmyReady', false)
    const { soldiers, enemyCreeps, walls, enemyStructures, mySpawn } = X

    if (!getIsArmyReady()) {
      if (soldiers.filter((c) => !c.data.isSpawning).length >= 6) setIsArmyReady(true)
    }

    const solider0IsAlive = soldiers[0] && soldiers[0].hits > 0
    const solider1IsAlive = soldiers[1] && soldiers[1].hits > 0

    for (const soldier of soldiers) {
      if (!soldier || !soldier.body || soldier.data.isSpawning) continue

      const closestEnemy = soldier.findClosestByRange(enemyCreeps)
      const closestWall = soldier.findClosestByRange(walls)
      const closestEnemyStructure = soldier.findClosestByRange(enemyStructures)

      if (!soldier.body) continue

      if (soldier.body.some((part) => part.type === ATTACK)) {
        if (getIsArmyReady()) {
          if (closestEnemy) {
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
          if (!getIsArmyReady()) {
            soldier.rangedAttack(closestEnemy)
            soldier.moveTo({ x: mySpawn.x + 2, y: mySpawn.y + 2 })
            continue
          }

          const attackResult = soldier.rangedAttack(closestEnemy)
          console.log('attackResult', closestEnemy, attackResult)
          if (attackResult === ERR_NOT_IN_RANGE) {
            if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
              if (closestWall) {
              }
            }

            if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
              soldier.moveTo(closestEnemy)
              if (soldier.rangedAttack(closestEnemy) === ERR_NOT_IN_RANGE) {
                if (closestWall) soldier.rangedAttack(closestWall)
              }
            } else {
              // Todo - better distance keeping
              soldier.moveTo({ x: -(soldier.x - closestEnemy.x), y: -(soldier.y - closestEnemy.y) })
            }
          } else {
            soldier.moveTo({ x: -(soldier.x - closestEnemy.x), y: -(soldier.y - closestEnemy.y) })
          }
        } else if (closestEnemyStructure) {
          if (!getIsArmyReady()) {
            soldier.moveTo({ x: mySpawn.x + 2, y: mySpawn.y + 2 })
            continue
          }

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

      // if (soldier.body.some((part) => part.type === HEAL)) {
      //   const myDamagedCreeps = soldiers.filter((i) => i.hits < i.hitsMax)
      //   if (myDamagedCreeps.length > 0) {
      //     if (soldier.heal(myDamagedCreeps[0]) === ERR_NOT_IN_RANGE) {
      //       soldier.moveTo(myDamagedCreeps[0])
      //     }
      //   } else {
      //     soldier.moveTo(soldiers[0])
      //   }
      // }
    }
  }
}
