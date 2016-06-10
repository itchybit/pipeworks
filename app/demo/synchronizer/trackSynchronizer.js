export default class TrackSynchronizer {
  constructor(syncDevice) {
    this.tracks = new Map();
    this.trackNames = [];
    this.time = 0;
    this.syncDevice = syncDevice;
  }

  addTrack(trackName) {
    this.trackNames.push(trackName);
    // this.tracks[trackName] = this.syncDevice.getTrack(trackName);
  }

  init() {
    console.log("tracksync init!");
    this.trackNames.forEach((trackName) => {
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
      if (this.tracks[trackName]){
        return this.tracks[trackName].getValue(this.time);
      } else {
        return 0.0
      }

    }
  }

  _printAll() {
    const all = new Map(this.trackNames.map((name) => {
      return [name, this.getCurrentValueFromTrack(name)];
    }));
    console.log(this.time + ":", all);
  }
}
