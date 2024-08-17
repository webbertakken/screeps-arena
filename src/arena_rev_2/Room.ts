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
import { Units } from './Units'
import { Registry } from './Registry'

export class Room {
  static read() {
    const myCreeps = getObjectsByPrototype(Creep).filter((i) => i.my) || []
    const enemyCreeps = getObjectsByPrototype(Creep).filter((i) => !i.my) || []
    const { enemies, enemyCount } = Room.getEnemies(enemyCreeps)
    const { workers, soldiers } = Units.categorise(myCreeps)
    const enemyStructures: OwnedStructure[] = []
    enemyStructures.push(...getObjectsByPrototype(StructureTower).filter((i) => !i.my))
    enemyStructures.push(...getObjectsByPrototype(StructureExtension).filter((i) => !i.my))
    enemyStructures.push(...getObjectsByPrototype(StructureSpawn).filter((i) => !i.my))
    enemyStructures.push(...getObjectsByPrototype(StructureRampart).filter((i) => !i.my))

    const room = {
      mySpawn: getObjectsByPrototype(StructureSpawn).filter((i) => i.my)[0],
      myExtensions: getObjectsByPrototype(StructureExtension).filter((i) => i.my),
      workers,
      soldiers,
      enemies,
      enemyCount,
      enemyCreeps: getObjectsByPrototype(Creep).filter((i) => !i.my),
      sources: getObjectsByPrototype(Source),
      walls: getObjectsByPrototype(StructureWall),
      containers: getObjectsByPrototype(StructureContainer),
      enemyStructures,
    }

    Registry.set('room', room)

    return room
  }

  private static getEnemies(enemyCreeps: Creep[]) {
    const enemies = {
      rangers: [] as Creep[],
      medics: [] as Creep[],
      melees: [] as Creep[],
      uncategorised: [...enemyCreeps] as Creep[],
    }

    return { enemies, enemyCount: enemyCreeps.length }
  }

  static planConstructionSites(mySpawn: StructureSpawn) {
    const myConstructionSites: ConstructionSite[] = []
    if (!Registry.get('constructionSites')) {
      createConstructionSite<StructureExtension>(
        { x: mySpawn.x + 2, y: mySpawn.y + 2 },
        StructureExtension,
      )?.object

      createConstructionSite<StructureExtension>(
        { x: mySpawn.x - 2, y: mySpawn.y - 2 },
        StructureExtension,
      )?.object
    }
    myConstructionSites.push(...getObjectsByPrototype(ConstructionSite).filter((i) => i.my))
    Registry.set('initialConstruction', true)
    return myConstructionSites
  }
}
