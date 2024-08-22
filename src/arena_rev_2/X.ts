import type { Unit } from './model/Unit'
import {
  ConstructionSite,
  Creep,
  Source,
  StructureContainer,
  StructureExtension,
  StructureRampart,
  StructureSpawn,
  StructureTower,
  StructureWall,
} from 'game/prototypes'
import type { Worker } from './model/Worker'
import type { Soldier } from './model/Soldier'

/**
 * Index of global tick state props.
 * - May contain references to instances.
 * - May not persist between ticks (use memory for that).
 * - Does not use in-game memory.
 *
 * Note: Props are explicitly defined so it reflects the model transparently.
 */
export class X {
  static myUnits: Unit[]
  static enemyCreeps: Creep[]
  static workers: Worker[]
  static soldiers: Soldier[]
  static enemies: { medics: Creep[]; uncategorised: Creep[]; rangers: Creep[]; melees: Creep[] }
  static enemyCount: number
  static enemyStructures: (
    | StructureTower
    | StructureExtension
    | StructureSpawn
    | StructureRampart
  )[]
  static sources: Source[]
  static myExtensions: StructureExtension[]
  static mySpawn: StructureSpawn
  static myConstructionSites: ConstructionSite[]
  static walls: StructureWall[]
  static containers: StructureContainer[]

  static clear(): void {
    // Set all properties to undefined.
    for (const key in X) {
      if (Object.prototype.hasOwnProperty.call(X, key)) {
        // @ts-expect-error - We assume that properties are set before they are used again.
        X[key] = undefined
      }
    }
  }
}
