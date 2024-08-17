import { BodyPartType, Creep } from 'game/prototypes'

export class Body {
  static fromParts(body: BodyPartType[]): Creep['body'] {
    return body.map((part) => ({ type: part, hits: 100 }))
  }
}
