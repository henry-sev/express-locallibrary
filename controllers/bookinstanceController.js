const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const async = require('async')

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const genre = require('../models/genre');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec((err, list_bookinstances) => {
            if (err) {return next(err)}
            res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec((err, book_instance) => {
            if (err) {return next(err)}
            if (book_instance==null) {
                let err = new Error('Book copy not find');
                err.status = 404;
                return next(err);
            }
            res.render('bookinstance_detail', {title: 'Book Instance Detail', bookinstance: book_instance});
        });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    Book.find()
        .exec((err, books) => {
            if (err) {return next(err)}
            res.render('bookinstance_form', {title: 'Create BookInstance', books: books});
        });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('book', 'Book must not be empty').isLength({min: 1}).trim(),
    body('imprint', 'Imprint must not be empty').isLength({min: 1}).trim(),
    body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),
    body('status', 'Status must not be empty').isLength({min: 1}).trim(),

    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('due_back').trim().escape(),
    sanitizeBody('status').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        
        let book_instance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status
        });

        if (!errors.isEmpty()) {
            Book.find()
                .exec((err, books) => {
                    if (err) {return next(err)}

                    // for (let i = 0; i < books.length; i++) {
                    //     if (book_instance.book === books[i]._id.toString()) {
                    //         book_instance.book.checked = 'true';
                    //     }
                    // }
                    res.render('bookinstance_form', {title: 'Create BookInstance', errors: errors.array(), books: books, book_instance: book_instance});
                });
            return;
        } else {
            book_instance.save((err) => {
                if (err) {return next(err)}
                res.redirect(book_instance.url);
            });
        }
    }
]

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec((err, book_instance) => {
            if (err) {return next(err)}

            if (book_instance==null) {
                res.redirect('/catalog/bookinstaces');
            }
            res.render('bookinstance_delete', {title: 'Delete Bookinstance', bookinstance: book_instance});
        });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    BookInstance.findByIdAndRemove(req.body.bookinstanceid, (err) => {
        if (err) {return next(err)}

        res.redirect('/catalog/bookinstances');
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id)
                .populate('book')
                .exec(callback);
        },

        books: function(callback) {
            Book.find(callback);
        }
    }, function(err, results) {
        if (err) {return next(err)}

        if (results.bookinstance==null) {
            let err = new Error('Bookinstance not found');
            err.status = 404;
            return next(err);
        } 

        res.render('bookinstance_form', {title: 'Update Bookinstance', books: results.books, book_instance: results.bookinstance});
    });
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
    body('book', 'Book must not be empty').isLength({min: 1}).trim(),
    body('imprint', 'Imprint must not be empty').isLength({min: 1}).trim(),
    body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),
    body('status', 'Status must not be empty').isLength({min: 1}).trim(),

    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('due_back').trim().escape(),
    sanitizeBody('status').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        

        let bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            Book.find({},(err, books) => {
                if (err) {return next(err)}

                res.render('bookinstance_form', {title: 'Update Bookinstance', books: books, book_instance: bookinstance, errors: errors.array()});
            });
            return;
        } else {
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, (err, theinstance) => {
                if (err) {return next(err)}

                res.redirect(theinstance.url);
            });
        }
    }
]