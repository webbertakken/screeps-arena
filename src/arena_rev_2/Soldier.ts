import { UnitData } from './UnitData'
import { ATTACK, HEAL, RANGED_ATTACK } from 'game/constants'
import { Unit } from './Unit'
import { Body } from './Body'
import { BodyPartType, Creep } from 'game/prototypes'

export type SoldierType = 'ranger' | 'medic' | 'melee' | 'unspecified'

export interface SoldierData extends UnitData {
  index: number
  hasMadeSpace: boolean
  type: SoldierType
}

export interface Soldier extends Unit {
  data: SoldierData
}

export class Soldier {
  static register(unit: Unit, index: number): Soldier {
    const soldier = unit as Soldier
    const { data } = soldier

    soldier.data = {
      ...data,
      index,
      type: this.detectType(unit.body),
    }

    return soldier
  }

  static detectType(bodyOrParts: Creep['body'] | BodyPartType[]): SoldierType {
    const body = bodyOrParts.some((part) => part.type) ? bodyOrParts : Body.fromParts(bodyOrParts)

    if (body.some((part) => part.type === ATTACK)) {
      return 'melee'
    } else if (body.some((part) => part.type === RANGED_ATTACK)) {
      return 'ranger'
    } else if (body.some((part) => part.type === HEAL)) {
      return 'medic'
    } else {
      return 'unspecified'
    }
  }

  // Todo - make pure
  static create(soldier: Soldier, data: SoldierData) {
    soldier.data = data

    return soldier
  }
}
