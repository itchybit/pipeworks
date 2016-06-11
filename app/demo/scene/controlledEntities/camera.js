import ControlledEntity from './controlledEntity';

import { CP_POS } from '../../constants';

export default class Camera extends ControlledEntity {
  constructor(name, trackSynchronizer) {
    const prototype = new Map([
      ['pos', CP_POS],
      ['target', CP_POS]
    ]);
    super('camera', name, prototype, trackSynchronizer);
  }
}
