import { UnitData } from '../model/UnitData'
import { Worker } from '../model/Worker'
import { Soldier } from '../model/Soldier'
import { X } from '../X'

export class Spawner {
  static spawnWhatIsNeeded() {
    const { mySpawn, workers, soldiers } = X

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
    } else if (soldiers.length < 6) {
      const firstRanged = UnitData.firstRanged(soldiers.length)
      const soldier = mySpawn.spawnCreep(firstRanged.body).object as Soldier
      if (soldier) soldiers.push(Soldier.create(soldier, firstRanged))
    } else if (soldiers.length < 7) {
      const firstHealer = UnitData.firstHealer(soldiers.length)
      const soldier = mySpawn.spawnCreep(firstHealer.body).object as Soldier
      if (soldier) soldiers.push(Soldier.create(soldier, firstHealer))
    }
  }

  static checkIfSpawningIsComplete() {
    const { mySpawn, myUnits } = X

    for (const unit of myUnits) {
      if (unit.data.isSpawning) {
        unit.moveTo(mySpawn)
        console.log(
          'unit',
          unit.x,
          unit.y,
          !unit.x || !unit.y,
          mySpawn.x === unit.x && mySpawn.y === unit.y,
        )
        if (!unit.x || !unit.y) continue
        if (mySpawn.x === unit.x && mySpawn.y === unit.y) continue
        unit.data.isSpawning = false
      }
    }
  }
}
