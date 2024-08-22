import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from 'game/constants'
import { X } from '../X'

export class WorkMaster {
  static instructWorkers() {
    const { workers, mySpawn, myExtensions, myConstructionSites, sources, containers } = X

    for (const worker of workers) {
      if (!worker || worker.data.isSpawning) continue

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
          if (worker.transfer(closestNonFullExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            worker.moveTo(closestNonFullExtension)
          }
        } else if (mySpawn.store.getFreeCapacity(RESOURCE_ENERGY)) {
          if (worker.transfer(mySpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            worker.moveTo(mySpawn)
          }
        } else if (myConstructionSites.length > 0) {
          const buildResult = worker.build(myConstructionSites[0])
          // Todo - properly build stuff
          //console.log('build result', buildResult)
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
  }
}
