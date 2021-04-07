const mongoose = require('mongoose');

//创建book模型
const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
  summary: {type: String, required: true},
  isbn: {type: String, required: true},
  genre:[{type: Schema.Types.ObjectId, ref: 'Gnere'}]
});

//创建虚拟属性：url
BookSchema
  .virtual('url')
  .get(function() {return '/catalog/book/' + this._id});

//导出模型
module.exports = mongoose.model('Book', BookSchema);