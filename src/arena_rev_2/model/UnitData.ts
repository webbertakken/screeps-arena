import { CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from 'game/constants'
import { Worker, WorkerData } from './Worker'
import { Soldier, SoldierData } from './Soldier'
import { Body } from './Body'
import { BodyParts, BodyPartsArray } from './BodyParts'

export interface UnitData {
  name: string
  body: BodyPartsArray
  cost: number
  isSpawning: boolean
}

export class UnitData {
  static initialTruck(index: number): WorkerData {
    const body = BodyParts.create([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY])

    return {
      index,
      name: 'Initial truck',
      body,
      cost: Body.getCost(body),
      type: Worker.detectType(body),
      isSpawning: true,
    }
  }

  static secondTruck(index: number): WorkerData {
    const body = BodyParts.create([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY])

    return {
      index,
      name: 'Second truck',
      body,
      cost: Body.getCost(body),
      type: Worker.detectType(body),
      isSpawning: true,
    }
  }

  static firstWorker(index: number): WorkerData {
    const body = BodyParts.addMoveParts([CARRY, CARRY, CARRY, WORK, WORK])

    return {
      index,
      name: 'First builder',
      body,
      cost: Body.getCost(body),
      type: Worker.detectType(body),
      isSpawning: true,
    }
  }

  static firstRanged(index: number): SoldierData {
    const body = BodyParts.addMoveParts([TOUGH, HEAL, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK])

    return {
      index,
      name: 'First ranged',
      body,
      cost: Body.getCost(body),
      type: Soldier.detectType(body),
      hasMadeSpace: false,
      isSpawning: true,
    }
  }

  static firstHealer(index: number): SoldierData {
    const body = BodyParts.addMoveParts([HEAL, HEAL, HEAL, HEAL, HEAL])

    return {
      index,
      name: 'First healer',
      body,
      cost: Body.getCost(body),
      type: Soldier.detectType(body),
      hasMadeSpace: false,
      isSpawning: true,
    }
  }
}
