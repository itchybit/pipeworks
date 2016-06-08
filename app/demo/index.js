import JSRocket from './services/jsRocket';
import TrackSynchronizer from './synchronizer/trackSynchronizer';
import { Pipe, Camera, Cog } from './controlledEntities';


class Demo {

  constructor() {
    const syncDevice = new JSRocket.SyncDevice();
    this.trackSynchronizer = new TrackSynchronizer(syncDevice);
    const controlledEntities = [
      new Pipe('p1', this.trackSynchronizer),
      new Pipe('p2', this.trackSynchronizer),
      new Camera('cam', this.trackSynchronizer),
      new Cog('cog', this.trackSynchronizer),
    ];
    syncDevice.init();
  }

  init() {
    console.log("Demo init");
  }

  updateValues() {

  }
}

export default new Demo();
