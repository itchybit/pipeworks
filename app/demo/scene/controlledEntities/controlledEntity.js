import SyncValueGroup from '../../synchronizer/syncValueGroup';

import { SEPARATOR } from '../../constants';

export default class ControlledEntity {
  constructor(type, name, prototype, trackSynchronizer) {
    this.type = type;
    this.name = name;
    this.controlPoints = []
    prototype.forEach((value, key) => {
      this.controlPoints.push([key, new SyncValueGroup(name + SEPARATOR + key, value, trackSynchronizer)]);
    });
    this.controlPoints = new Map(this.controlPoints)
  }
  getAll(){
    let ret = [['type', this.type]]
    this.controlPoints.forEach((value, key) => {
      ret.push([key, value.getAll()]);
    })
    return new Map(ret);
  }
}
