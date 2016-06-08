import ControlledEntity from './controlledEntity';

import { CP_VERTEX } from '../constants';

export default class Cog extends ControlledEntity {
  constructor(name, trackSynchronizer) {
    const prototype = new Map([
      ['pos', CP_VERTEX]
    ]);
    super('cog', name, prototype, trackSynchronizer);
  }
}
