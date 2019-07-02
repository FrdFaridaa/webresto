
var express = require('express');
var router = express.Router();
var Pemesanan = require('../model/pemesanan');
var Auth_mdw = require('../middlewares/auth');

/* GET users listing. */
router.get('/datapemesanan', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session

    // Pemesanan.find({}, function(err, pemesanan) {
    //     //console.log(buku);
    //     res.render('admin/menu/table_pemesanan', { session_store: session_store, pemesanans: pemesanan })
    // }).select('_id kodepemesanan kodemenu qty total ')
    Pemesanan.aggregate([{
        $lookup: {
            from: "menus",
            localField: "kodemenu",
            foreignField: "kodemenu",
            as: "data"
        }
    }], function(err, pemesanan) {
        res.render('admin/menu/table_pemesanan', { session_store: session_store, pemesanans: pemesanan })
    })
});
/* GET users listing. */
router.get('/inputpemesanan', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/menu/input_pemesanan', { session_store: session_store})
});
//input data pemesanan
router.post('/inputpemesanan', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session

    Pemesanan.find({ kodepemesanan: req.body.kodepemesanan }, function(err, pemesanan) {
        if (pemesanan.length == 0) {
            var datapemesanan = new Pemesanan({
                kodepemesanan: req.body.kodepemesanan,
                kodemenu: req.body.kodemenu,
                qty: req.body.qty,
                total: req.body.total
            })
            datapemesanan.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datapemesanan')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datapemesanan')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode buku sudah ada....')
            res.render('admin/menu/input_pemesanan', {
                session_store: session_store,
                kodepemesanan: req.body.kodepemesanan,
                kodemenu: req.body.kodemenu,
                qty: req.body.qty,
                total: req.body.total
            })
        }
    })
})
router.post('/:id/delete', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    Pemesanan.findById(req.params.id, function(err, pemesanan){
        pemesanan.remove(function(err, pemesanan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data pemesanan berhasil dihapus!');
            }
            res.redirect('/datapemesanan');
        })
    })
})
//menampilkan data berdasarkan id
router.get('/:id/editmenu', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
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

router.post('/:id/editmenu', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
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

