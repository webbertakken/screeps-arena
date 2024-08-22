import { Coordinator } from './managers/Coordinator'
import { Spawner } from './managers/Spawner'
import { WorkMaster } from './managers/WorkMaster'
import { Commander } from './managers/Commander'
import { X } from './X'

export function loop() {
  X.clear()

  Coordinator.readTheRoom()
  Coordinator.planConstructionSites()

  Spawner.checkIfSpawningIsComplete()
  Spawner.spawnWhatIsNeeded()

  WorkMaster.instructWorkers()
  Commander.instructSoldiers()
}
