import ControlledEntity from './controlledEntity';

import { CP_VERTEX } from '../constants';

export default class Camera extends ControlledEntity {
  constructor(name, trackSynchronizer) {
    const prototype = new Map([
      ['pos', CP_VERTEX]
    ]);
    super('camera', name, prototype, trackSynchronizer);
  }
}
