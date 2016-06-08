import JSRocket from './services/jsRocket';
import TrackSynchronizer from './synchronizer/trackSynchronizer';
import { Pipe, Camera, Cog } from './scene/controlledEntities';
import Renderer from './render/renderer';


class Demo {

  constructor() {
    const syncDevice = new JSRocket.SyncDevice();
    this.trackSynchronizer = new TrackSynchronizer(syncDevice);
    // Test entities, move to actual scene when implemented
    const controlledEntities = [
      new Pipe('p1', this.trackSynchronizer),
      new Pipe('p2', this.trackSynchronizer),
      new Camera('cam', this.trackSynchronizer),
      new Cog('cog', this.trackSynchronizer),
    ];

    this.renderer = new Renderer();

    syncDevice.init();
  }

  init() {
    console.log("Demo init");
  }

  updateValues() {

  }

  render(context) {
    this.renderer.render({}, context);
  }

  update() {

  }
}

export default new Demo();
