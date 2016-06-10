import monkey from "../static/monkey.obj"
import OBJ from "webgl-obj-loader"

const model_data = new Map([
  ['monkey', monkey],
  ['other_monkey', monkey],
])

const models = new Map()

model_data.forEach((value, key) => {
  models.set(key, new OBJ.Mesh(value))
});

console.log(models);

export default models
