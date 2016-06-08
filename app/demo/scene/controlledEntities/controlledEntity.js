import SyncValueGroup from '../../synchronizer/syncValueGroup';

import { SEPARATOR } from '../../constants';

export default class ControlledEntity {
  constructor(type, name, prototype, trackSynchronizer) {
    this.type = type;
    this.name = name;
    this.controlPoints = prototype.forEach((value, key) => {
      return new SyncValueGroup(name + SEPARATOR + key, value, trackSynchronizer);
    });
  }
}
