import JSRocket from './services/jsRocket';
import {vMan} from './ValueManager'
import {Pipe, Camera, Cog} from './DynamicEntity'

const DYNAMIC_ENTITIES = [
  new Pipe('p1'),
  new Pipe('p2'),
  new Camera('cam'),
  new Cog('cog'),
]

class Demo {

  constructor() {
    this.syncDevice = new JSRocket.SyncDevice();

  }

  init() {
    console.log("Demo init");
    this.syncDevice.on('ready', () => {this.onSyncReady()});
    this.syncDevice.on('update', (row) => {this.onSyncUpdate(row)});
    this.syncDevice.on('play', () => {this.onPlay()});
    this.syncDevice.on('pause', () => {this.onPause()});
    this.syncDevice.init();

  }

  updateValues() {

  }

  onSyncReady() {
    vMan.init(this.syncDevice)
    console.log("onSyncReady");
  }

  onSyncUpdate(row) {
    vMan.time = row
    console.log("onSyncUpdate", row);
    var de = DYNAMIC_ENTITIES[0];
    console.log(JSON.stringify( de.getAll() ));
  }

  onPlay() {
    console.log("onPlay");
  }

  onPause() {
    console.log("onPause");
  }

}

export default new Demo();
