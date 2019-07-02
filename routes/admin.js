var express = require('express');

var router = express.Router();
var multer  = require('multer')
var express = require('express');
var crypto = require('crypto');
var User = require('../model/user');
var Menu = require('../model/menu');
var Auth_mdw = require('../middlewares/auth');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
})

var upload = multer({ storage: storage })


var router = express.Router();
var secret = 'rahasia';
var session_store;

/* GET users listing. */
router.get('/admin', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});
/* GET users listing. */
router.get('/datamenu', Auth_mdw.check_login, Auth_mdw.is_admin, upload.single('foto'), function(req, res, next) {
    session_store = req.session

    Menu.find({}, function(err, menu) {
        //console.log(buku);
        res.render('admin/menu/table', { session_store: session_store, menus: menu })
    }).select('_id kodemenu namamenu tipemenu harga foto ')
});
/* GET users listing. */
router.get('/inputmenu', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/menu/input_data', { session_store: session_store})
});
//input data buku
router.post('/inputmenu', Auth_mdw.check_login, Auth_mdw.is_admin, upload.single('foto'), function(req, res, next) {
    session_store = req.session

    Menu.find({ kodemenu: req.body.kodemenu }, function(err, menu) {
        if (menu.length == 0) {
            var datamenu = new Menu({
                kodemenu: req.body.kodemenu,
                namamenu: req.body.namamenu,
                tipemenu: req.body.tipemenu,
                harga: req.body.harga,
                foto : req.file.filename
            })
            datamenu.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datamenu')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datamenu')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode buku sudah ada....')
            res.render('admin/menu/input_data', {
                session_store: session_store,
                kodemenu: req.body.kodemenu,
                namamenu: req.body.namamenu,
                tipemenu: req.body.tipemenu,
                harga: req.body.harga,
                foto : req.file.filename
            })
        }
    })
})
router.post('/:id/delete', Auth_mdw.check_login, Auth_mdw.is_admin, upload.single('foto'), function(req, res, next) {
    Menu.findById(req.params.id, function(err, menu){
        menu.remove(function(err, menu){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data menun berhasil dihapus!');
            }
            res.redirect('/datamenu');
        })
    })
})
//menampilkan data berdasarkan id
router.get('/:id/editmenu', Auth_mdw.check_login, Auth_mdw.is_admin, upload.single('foto'), function(req, res, next) {
    session_store = req.session

    Menu.findOne({ _id: req.params.id }, function(err, menu) {
        if (menu) {
            console.log("menusss"+menu);
            res.render('admin/menu/edit_data', { session_store: session_store, menus: menu })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datamenu')
        }
    })
})

router.post('/:id/editmenu', Auth_mdw.check_login, Auth_mdw.is_admin, upload.single('foto'), function(req, res, next) {
    session_store = req.session

    Menu.findById(req.params.id, function(err, menu) {
        menu.kodemenu = req.body.kodemenu;
        menu.namamenu = req.body.namamenu;
        menu.tipemenu = req.body.tipemenu;
        menu.harga = req.body.harga;
        menu.foto = req.file.filename;

        menu.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datamenu');

        });
    });
})


module.exports = router;
