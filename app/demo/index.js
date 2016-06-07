import JSRocket from './services/jsRocket';

const VALUES = new Map()

class Demo {

  constructor() {
    this.syncDevice = new JSRocket.SyncDevice();
    this.row = 0;
  }

  init() {
    console.log("Demo init");
    this.syncDevice.init();

    this.syncDevice.on('ready', () => {this.onSyncReady()});
    this.syncDevice.on('update', (row) => {this.onSyncUpdate(row)});
    this.syncDevice.on('play', () => {this.onPlay()});
    this.syncDevice.on('pause', () => {this.onPause()});
  }

  updateValues() {

  }

  onSyncReady() {
    console.log("onSyncReady");
  }

  onSyncUpdate(row) {
    console.log("onSyncUpdate", row);
    this.row = row;
  }

  onPlay() {
    console.log("onPlay");
  }

  onPause() {
    console.log("onPause");
  }

}

export default new Demo();
