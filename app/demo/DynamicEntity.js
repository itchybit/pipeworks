import {vMan, ValueGroup, SEPARATOR} from './ValueManager'

const CP_VERTEX = ['x', 'y', 'z']

export class DynamicEntity {
  /*
    type: Type of the DE
    name: Name of the DE
    proto: "Prototype" object of the DE
    ValueGroups will be created to match the stricture of the proto object
    */
  constructor(type, name, proto){
    this.type = type
    this.name = name
    this.valueGroups = {}
    for (var p in proto){
      this.valueGroups[p] = new ValueGroup(name + SEPARATOR + p, proto[p])
    }
  }

  getAll(){
    var ret = {}
    for(var vgn in this.valueGroups){
      ret[vgn] = this.valueGroups[vgn].getAll()
    }
    return ret
  }

}

export class Pipe extends DynamicEntity {
  constructor(name){
    let proto = {
      'start': CP_VERTEX,
      'end': CP_VERTEX,
    }
    super('pipe', name, proto);
  }
}

export class Camera extends DynamicEntity{

  constructor(name){
    let proto = {
      'loc': CP_VERTEX,
    }
    super('camera', name, proto);
  }
}

export class Cog extends DynamicEntity{

  constructor(name){
    let proto = {
      'loc': CP_VERTEX,
    }
    super('cog', name, proto);
  }
}
