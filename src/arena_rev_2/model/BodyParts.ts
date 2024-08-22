import { MOVE } from 'game/constants'

export type BodyPartsArray = BodyPartType[]

export class BodyParts {
  static create(bodyParts: BodyPartsArray): BodyPartsArray {
    return bodyParts
  }

  static addMoveParts(bodyParts: BodyPartsArray): BodyPartsArray {
    return [...bodyParts, ...bodyParts.map(() => MOVE as BodyPartType)]
  }
}
