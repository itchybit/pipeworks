export default class SyncValue {
  constructor(trackName, trackSynchronizer) {
    this.trackName = trackName;
    this.trackSynchronizer = trackSynchronizer;
    this.trackSynchronizer.addTrack(trackName);
  }

  get() {
    return trackSynchronizer.getCurrentValueFromTrack(this.trackName);
  }
}
