export const SEPARATOR = '_';

class ValueManager {
  constructor(){
    this.tracks = {}
    this.time = 0
    this.trackKeys = []
  }

  /* This will create tracks that were added before */
  init(sd){
    this.sd = sd;
    for (var i in this.trackKeys){
      var k = this.trackKeys[i]
      this.tracks[k] = this.sd.getTrack(k);
    }
  }

  /* Adds key to trackKeys. Tracks are created at init */
  addTrack(key){
    this.trackKeys.push(key)
  }

  /* Gets value from trak named 'key' */
  get(key){
    if(key == 'time'){ // Global time
      return this.time
    }
    return this.tracks[key].getValue(this.time);
  }
}

const vMan = new ValueManager()

export {vMan}

export class Value {
  constructor(key){
    this.key = key;
    vMan.addTrack(key);
  }

  /* Returns the current value */
  get(){
    return vMan.get(this.key);
  }

}

export class ValueGroup { // aka control point
  constructor(name, items){
    this.name = name;
    this.values = {}
    items.forEach( (n) => { this.values[n] = new Value(this.name + SEPARATOR + n)} )
  }

  /* Returns the current value of item */
  get(item){ //
    return this.values[item].get()
  }

  /* Returns object with all items and their current values. */
  getAll(){ //
    let ret = {}
    for (var value in this.values) {
      ret[value] = this.get(value);
    }
    return ret;
  }
}
