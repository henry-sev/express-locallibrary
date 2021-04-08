const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');

//显示完整的作者列表
exports.author_list = (req, res, next) => {
  Author.find()
    .sort({first_name: 1})
    .exec((err, list_authors) => {
      if (err) {return next(err)}
      res.render('author_list', {title: 'Author List', author_list: list_authors});
    });
};

//为每位作者显示详细信息的页面
exports.author_detail = (req, res, next) => {
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id)
        .exec(callback)
    },
    book: function(callback) {
      Book.find({'author': req.params.id})
        .exec(callback)
    },
  }, function(err, results) {
    if (err) {return next(err)}
    if (results.author==null) {
      let err = new Error('Author not find');
      err.status = 404;
      return next(err);
    }
    res.render('author_detail', {title: 'Author Detail', author: results.author, books: results.book})
  });
};

//由get显示创建作者的表单
exports.author_create_get = (req, res) => {res.send('未实现：作者创建表单的 GET'); };

//由post处理创建操作
exports.author_create_post = (req, res) => {res.send('未实现：创建作者的 POST'); };

// 由 GET 显示删除作者的表单
exports.author_delete_get = (req, res) => { res.send('未实现：作者删除表单的 GET'); };

// 由 POST 处理作者删除操作
exports.author_delete_post = (req, res) => { res.send('未实现：删除作者的 POST'); };

// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res) => { res.send('未实现：作者更新表单的 GET'); };

// 由 POST 处理作者更新操作
exports.author_update_post = (req, res) => { res.send('未实现：更新作者的 POST'); };