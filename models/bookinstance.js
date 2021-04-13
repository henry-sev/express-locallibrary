const mongoose = require('mongoose');
const moment = require('moment');
const { json } = require('express');

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
  .get(function() {return '/catalog/bookinstance/' + this._id});

BookInstanceSchema
  .virtual('due_back_formatted')
  .get(function() {return moment(this.due_back).format('MMMM Do, YYYY')});

BookInstanceSchema
  .virtual('due_back_formatted2')
  .get(function() {return moment(this.due_back).format('YYYY-MM-DD')});

//导出模型
module.exports = mongoose.model('BookInstance', BookInstanceSchema);