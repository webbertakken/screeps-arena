import { createConstructionSite, getObjectsByPrototype } from 'game/utils'
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
import { Units } from '../model/Units'
import { useMemory } from '../../lib'
import { Unit } from '../model/Unit'
import { X } from '../X'

export class Coordinator {
  static readTheRoom() {
    const [getTickState, setTickState] = useMemory<number>('tick', 0)
    setTickState(getTickState() + 1)

    X.myUnits = getObjectsByPrototype(Creep).filter((i) => i.my) as Unit[]
    X.enemyCreeps = getObjectsByPrototype(Creep).filter((i) => !i.my)

    const { workers, soldiers } = Units.categorise(X.myUnits)
    X.workers = workers
    X.soldiers = soldiers

    const { enemies, enemyCount } = Coordinator.getEnemies(X.enemyCreeps)
    X.enemies = enemies
    X.enemyCount = enemyCount

    X.enemyStructures = [
      ...getObjectsByPrototype(StructureTower).filter((i) => !i.my),
      ...getObjectsByPrototype(StructureExtension).filter((i) => !i.my),
      ...getObjectsByPrototype(StructureSpawn).filter((i) => !i.my),
      ...getObjectsByPrototype(StructureRampart).filter((i) => !i.my),
    ]
    X.sources = getObjectsByPrototype(Source)
    X.myExtensions = getObjectsByPrototype(StructureExtension).filter((i) => i.my)
    X.mySpawn = getObjectsByPrototype(StructureSpawn).filter((i) => i.my)[0]
    X.myConstructionSites = getObjectsByPrototype(ConstructionSite).filter((i) => i.my)
    X.walls = getObjectsByPrototype(StructureWall)
    X.containers = getObjectsByPrototype(StructureContainer)

    useMemory('isLeft', X.mySpawn.x <= 49)

    // Todo - Roads, resources on the ground
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

  static planConstructionSites() {
    const [getIsPlanned, setIsPlanned] = useMemory<boolean>('isConstructionPlanned', false)

    if (!getIsPlanned()) {
      const { mySpawn } = X

      // @ts-ignore
      createConstructionSite<StructureExtension>(
        { x: mySpawn.x + 2, y: mySpawn.y + 2 },
        StructureExtension,
      )?.object

      // @ts-ignore
      createConstructionSite<StructureExtension>(
        { x: mySpawn.x - 2, y: mySpawn.y - 2 },
        StructureExtension,
      )?.object

      X.myConstructionSites = getObjectsByPrototype(ConstructionSite).filter((i) => i.my)
      setIsPlanned(true)
    }
  }
}
