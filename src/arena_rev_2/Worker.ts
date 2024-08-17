import { UnitData } from './UnitData'
import { CARRY, WORK } from 'game/constants'
import { Unit } from './Unit'
import { BodyPartType, Creep } from 'game/prototypes'
import { Body } from './Body'

export type WorkerType = 'truck' | 'builder' | 'unspecified'

export interface WorkerData extends UnitData {
  index: number
  type: WorkerType
}

export interface Worker extends Unit {
  data: WorkerData
}

export class Worker {
  static register(unit: Unit, index: number): Worker {
    const worker = unit as Worker
    const { data } = worker

    worker.data = {
      ...data,
      index,
      type: this.detectType(unit.body),
    }

    return worker
  }

  static detectType(bodyOrParts: Creep['body'] | BodyPartType[]): WorkerType {
    const body = bodyOrParts.some((part) => part.type) ? bodyOrParts : Body.fromParts(bodyOrParts)

    if (body.some((part) => part.type === WORK)) {
      return 'builder'
    } else if (body.some((part) => part.type === CARRY)) {
      return 'truck'
    } else {
      return 'unspecified'
    }
  }

  // Todo - make pure
  static create(worker: Worker, data: WorkerData) {
    worker.data = data

    return worker
  }
}
