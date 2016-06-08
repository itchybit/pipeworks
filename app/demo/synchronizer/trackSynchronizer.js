export default class TrackSynchronizer {
  constructor(syncDevice) {
    this.tracks = new Map();
    this.trackNames = [];
    this.time = 0;
    this.syncDevice = syncDevice;

    syncDevice.on('ready', () => this._init());
    syncDevice.on('update', (time) => this._update(time));
    syncDevice.on('play', () => this._play());
    syncDevice.on('pause', () => this._pause());
  }

  addTrack(trackName) {
    this.trackNames.push(trackName);
    this.tracks[trackName] = this.syncDevice.getTrack(trackName);
  }

  _init() {
    this.trackNames.forEach((trackName) => {
      console.log("Sync ready!");
      this.tracks[trackName] = this.syncDevice.getTrack(trackName);
    });
  }

  _update(time) {
    this.time = time;
    this._printAll();
  }

  _play() {
    console.log("Play");
  }

  _pause() {
    console.log("pause");
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
