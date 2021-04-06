const mongoose = require('mongoose');

//创建genre模型
const Schema = mongoose.Schema;
const GenreSchema = new Schema({
  name: {type: String, required: true, min: 3, max: 100}
});

//创建虚拟属性：url
GenreSchema
  .virtual('url')
  .get(() => 'catalog/genre/' + this._id);

//导出模型
module.exports = mongoose.model('Genre', GenreSchema);