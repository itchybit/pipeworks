

export default class Scene {
  constructor(entities){
    this.entities = new Map(entities.map((entity) =>[entity.name, entity]));
  }

  getAll(){
    let ret = []
    this.entities.forEach((value, key) => {
      ret.push([key, value.getAll()]);
    })
    return new Map(ret);
  }

}
