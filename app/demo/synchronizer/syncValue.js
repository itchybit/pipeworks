import {defaultSyncValues, trackedValues} from "../constants/defaultSyncValues"

export default class SyncValue {
  constructor(trackName, trackSynchronizer) {
    this.trackName = trackName;
    this.trackSynchronizer = trackSynchronizer;
    this.tracked = trackedValues.indexOf(this.trackName) > -1;
    if (this.tracked){
      this.trackSynchronizer.addTrack(trackName);
    }
    else if (!defaultSyncValues.hasOwnProperty(this.trackName)) {
      console.warn("No default sync value for untracked track " + this.trackName);
    }
  }

  get() {
    if (this.tracked) {
      const defaultValue = defaultSyncValues[this.trackName];
      if (defaultValue){
        return defaultValue + this.trackSynchronizer.getCurrentValueFromTrack(this.trackName);
      } else {
        return this.trackSynchronizer.getCurrentValueFromTrack(this.trackName);
      }
    } else if (defaultSyncValues[this.trackName]) {
      return defaultSyncValues[this.trackName];
    } else {
      return 0.0;
    }
  }
}
