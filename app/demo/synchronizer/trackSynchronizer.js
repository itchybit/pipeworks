export default class TrackSynchronizer {
  constructor(syncDevice) {
    this.tracks = new Map();
    this.trackNames = [];
    this.time = 0;
    this.syncDevice = syncDevice;
  }

  addTrack(trackName) {
    this.trackNames.push(trackName);
    this.tracks[trackName] = this.syncDevice.getTrack(trackName);
  }

  init() {
    this.trackNames.forEach((trackName) => {
      console.log("Sync ready!");
      this.tracks[trackName] = this.syncDevice.getTrack(trackName);
    });
  }

  setTime(time) {
    this.time = time;
    // this._printAll();
  }

  getCurrentValueFromTrack(trackName) {
    if (trackName === 'time') {
      return this.time;
    } else {
      return this.tracks[trackName].getValue(this.time);
    }
  }

  _printAll() {
    const all = new Map(this.trackNames.map((name) => {
      return [name, this.getCurrentValueFromTrack(name)];
    }));
    console.log(this.time + ":", all);
  }
}
