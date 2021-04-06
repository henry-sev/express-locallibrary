const mongoose = require('mongoose');

//创建bookInstance模型
const Schema = mongoose.Schema;
const BookInstanceSchema = new Schema({
  book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
  imprint: {type: String, required: true},
  status: {
    type: String, 
    required: true, 
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance'
  },
  due_back: {type: Date, default: Date.now}
})

//创建虚拟属性：url
BookInstanceSchema
  .virtual('url')
  .get(() => '/catalog/bookinstance/' + this._id);

//导出模型
module.exports = mongoose.model('BookInstance', BookInstanceSchema);