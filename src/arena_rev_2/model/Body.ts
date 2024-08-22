import { Creep } from 'game/prototypes'
import { ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from 'game/constants'
import { BodyPartsArray } from './BodyParts'

export type BodyOrParts = Creep['body'] | BodyPartsArray

const COST: Record<BodyPartType, number> = {
  [MOVE]: 50,
  [WORK]: 100,
  [CARRY]: 50,
  [ATTACK]: 80,
  [RANGED_ATTACK]: 150,
  [HEAL]: 250,
  [TOUGH]: 10,
}

export class Body {
  static from(bodyOrParts: BodyOrParts): Creep['body'] {
    return Body.isSimpleBody(bodyOrParts) ? Body.fromParts(bodyOrParts) : bodyOrParts
  }

  static fromParts(bodyParts: BodyPartsArray): Creep['body'] {
    return bodyParts.map((part) => ({ type: part, hits: 100 }))
  }

  static isSimpleBody(bodyOrParts: BodyOrParts): bodyOrParts is BodyPartType[] {
    return bodyOrParts.some((part) => typeof part === 'string')
  }

  static getCost(bodyOrParts: BodyOrParts): number {
    return Body.from(bodyOrParts).reduce((cost, part) => cost + COST[part.type as BodyPartType], 0)
  }
}
