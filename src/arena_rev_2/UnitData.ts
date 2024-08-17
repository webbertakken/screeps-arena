import { BodyPartType } from 'game/prototypes'
import { CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from 'game/constants'
import { Worker, WorkerData } from './Worker'
import { Soldier, SoldierData } from './Soldier'

export interface UnitData {
  name: string
  cost: number
  body: BodyPartType[]
}

export class UnitData {
  static initialTruck(index: number): WorkerData {
    const body = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
    return {
      name: 'Initial truck',
      cost: 300,
      index,
      type: Worker.detectType(body),
      body,
    }
  }

  static secondTruck(index: number): WorkerData {
    const body = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
    return {
      name: 'Second truck',
      cost: 300,
      index,
      type: Worker.detectType(body),
      body,
    }
  }

  static firstWorker(index: number): WorkerData {
    const body = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK]

    return {
      name: 'First builder',
      cost: 500,
      index,
      type: Worker.detectType(body),
      body,
    }
  }

  static firstRanged(index: number): SoldierData {
    const body = [
      TOUGH,
      MOVE,
      MOVE,
      MOVE,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
    ]

    return {
      name: 'First ranged',
      cost: 900,
      index,
      type: Soldier.detectType(body),
      body,
      hasMadeSpace: false,
    }
  }

  static firstHealer(index: number): SoldierData {
    const body = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, HEAL, HEAL]

    return {
      name: 'First healer',
      cost: 800,
      index,
      type: Soldier.detectType(body),
      body,
      hasMadeSpace: false,
    }
  }
}
