import { Creep } from 'game/prototypes'
import { UnitData } from './UnitData'

export interface Unit extends Creep {
  data: UnitData
}
