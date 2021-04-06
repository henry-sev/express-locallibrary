const mongoose = require('mongoose');

//创建作者模型
const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
  first_name: {type: String, required: true, max: 100},
  family_name: {type: String, required: true, max: 100},
  date_of_birth: {type: Date},
  date_of_death: {type: Date}
})

//创建作者模型虚拟属性：name, lifespan, url
AuthorSchema
  .virtual('name')
  .get(() => this.first_name + this.family_name);

AuthorSchema
  .virtual('lifespan')
  .get(() => this.date_of_death.getYear() - this.date_of_birth.getYear());

AuthorSchema
  .virtual('url')
  .get(() => '/catalog/author/' + this._id);

//导出模型
module.exports = mongoose.model('Author', AuthorSchema);