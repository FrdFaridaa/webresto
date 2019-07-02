var express = require('express');

var router = express.Router();

var express = require('express');

var crypto = require('crypto');
var User = require('../model/user');
var Auth_mdw = require('../middlewares/auth');

var router = express.Router();
var secret = 'rahasia';
var session_store;

router.get('/',Auth_mdw.is_login, function(req, res, next) {
    session_store = req.session;
    res.render('login', { title: 'selamat datang', session_store:session_store });
});

//fungsi login
router.post('/login', function(req, res, next) {
    session_store = req.session
    var password = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('hex')
    if (req.body.email == '' || req.body.password == '') {
        req.flash('info', 'Maaf, tidak boleh ada field yang kosong')
        res.redirect('/')
    }
    else {
        User.find({
            email: req.body.email,
            password: password
        }, function(err, user) {
            if (err) throw err

            if (user.length > 0) {
                session_store.username = user[0].username
                session_store.email = user[0].email
                session_store.admin = user[0].admin
                session_store.firstname = user[0].firstname
                session_store.logged_in = true
                res.redirect('/admin')
            } else {
                req.flash('info', 'Kayaknya akun Anda salah')
                res.redirect('/')
                console.log(req.body.email)
            }
        })
    }
})
//logout
router.get('/logout', function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/login');
        }
    });
});


module.exports = router;
