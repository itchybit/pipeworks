import ControlledEntity from './controlledEntity';

import { CP_VERTEX } from '../../constants';

export default class Pipe extends ControlledEntity {
  constructor(name, trackSynchronizer) {
    const prototype = new Map([
      ['start', CP_VERTEX],
      ['end', CP_VERTEX]
    ]);
    super('pipe', name, prototype, trackSynchronizer);
  }
}
