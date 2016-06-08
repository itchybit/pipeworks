import JSRocket from './services/jsRocket';
import TrackSynchronizer from './synchronizer/trackSynchronizer';
import { Pipe, Camera, Cog } from './scene/controlledEntities';
import Renderer from './render/renderer';


class Demo {

  constructor() {
    const syncDevice = new JSRocket.SyncDevice();
    syncDevice.on('play', () => this.play());
    syncDevice.on('pause', () => this.pause());
    syncDevice.on('update', (time) => this.setTime(time));
    syncDevice.on('ready', () => this.init());
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
    this.trackSynchronizer.init();
  }

  update(time) {
    this.trackSynchronizer.setTime(time);
  }

  render(context) {
    this.renderer.render({}, context);
  }

  togglePlay() {
    this.playing = !this.playing;
  }

  play() {
    this.playing = true;
    console.log("Play");
  }

  pause() {
    this.playing = false;
    console.log("Pause");
  }

  setTime(time) {
    console.log("Setting time");
    this.trackSynchronizer.setTime(time);
  }
}

export default new Demo();
