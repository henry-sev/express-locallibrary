const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

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
exports.author_create_get = (req, res) => {
  res.render('author_form', {title: 'Create Author'});
};

//由post处理创建操作
exports.author_create_post = [
  body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: 1}).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({checkFalsy: 1}).isISO8601(),

  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
    }
    else {
      let author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });

      author.save((err) => {
        if (err) {return next(err)}
        res.redirect(author.url);
      });
    } 
  }
];

// 由 GET 显示删除作者的表单
exports.author_delete_get = (req, res, next) => { 
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id)
        .exec(callback)
    },
    author_books: function(callback) {
      Book.find({author: req.params.id})
        .exec(callback)
    },
  }, function(err, results) {
    if (err) {return next(err)}

    if (results.author==null) {
      res.redirect('/catalog/authors');
    }
    res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.author_books});
  });
 };

// 由 POST 处理作者删除操作
exports.author_delete_post = (req, res, next) => { 
  async.parallel({
    author: function(callback) {
      Author.findById(req.body.authorid)
        .exec(callback)
    },
    author_books: function(callback) {
      Book.find({author: req.body.authorid})
        .exec(callback)
    },
  }, function(err, results) {
    if (err) {return next(err)}

    if (results.author_books.length > 0) {
      res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.author_books});
    } else {
      Author.findByIdAndRemove(req.body.authorid, (err) => {
        if (err) {return next(err)}
        res.redirect('/catalog/authors');
      });
    } 
  });
 };

// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res, next) => { 
  Author.findById(req.params.id, (err, author) => {
    if (err) {return next(err)}

    if (author==null) {
      let err = new Error('Author not find');
      err.status = 404;
      return next(err);
    } 

    res.render('author_form', {title: 'Create Author', author: author});
  })
 };

// 由 POST 处理作者更新操作
exports.author_update_post = [
  body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: 1}).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({checkFalsy: 1}).isISO8601(),

  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    let author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('author_form', {title: 'Create Author', author: author, errors: errors.array()});
      return;
    } else {
      Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
        if (err) {return next(err)}

        res.redirect(theauthor.url);
      })
    }
  }
]