const mongoose = require('mongoose');
const moment = require('moment');

//创建作者模型
const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
  first_name: {type: String, required: true, max: 100},
  family_name: {type: String, required: true, max: 100},
  date_of_birth: {type: Date},
  date_of_death: {type: Date}
})

//创建作者模型虚拟属性：name, lifespan, url
// AuthorSchema
//   .virtual('name')
//   .get(() => {return this.first_name + this.family_name});

AuthorSchema
  .virtual('name')
  .get(function() {return this.family_name + ', ' + this.first_name});
  //为什么回调简写会出错
  //.get(() => this.family_name + ', ' + this.first_name);

AuthorSchema
  .virtual('lifespan')
  .get(function() {return this.date_of_death.getYear() - this.date_of_birth.getYear()});

AuthorSchema
  .virtual('url')
  .get(function() {return '/catalog/author/' + this._id});

AuthorSchema
  .virtual('date_of_birth_formatted')
  .get(function() {return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : ''});

AuthorSchema
  .virtual('date_of_death_formatted')
  .get(function() {return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : ''});

//导出模型
module.exports = mongoose.model('Author', AuthorSchema);