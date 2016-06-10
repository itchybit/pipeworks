import SyncValue from './SyncValue';

import { SEPARATOR } from '../constants';

export default class SyncValueGroup {
  constructor(groupName, syncValueNames, trackSynchronizer) {
    this.groupName = groupName;
    this.syncValues = new Map(
      syncValueNames.map((name) => {
        return [
          name, new SyncValue(groupName + SEPARATOR + name, trackSynchronizer)
        ];
      })
    );
  }

  get(syncValueName) {
    return this.syncValues[syncValueName].get();
  }

  getAll() {
    let ret = []
    this.syncValues.forEach((value, key) => {
      ret.push([key, value.get()]);
    })
    return new Map(ret);
  }
}
