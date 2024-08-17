import { Creep } from 'game/prototypes'
import { Worker } from './Worker'
import { Soldier } from './Soldier'
import { Unit } from './Unit'

export class Units {
  static categorise(myCreeps: Creep[]): { workers: Worker[]; soldiers: Soldier[] } {
    const units = { workers: [] as Worker[], soldiers: [] as Soldier[] }

    for (const creep of myCreeps) {
      const unit = creep as Unit
      if (!unit) continue

      if (unit.body.some((part) => part.type === 'carry')) {
        units.workers.push(Worker.register(unit, units.workers.length))
      } else {
        units.soldiers.push(Soldier.register(unit, units.soldiers.length))
      }
    }

    return units
  }
}
