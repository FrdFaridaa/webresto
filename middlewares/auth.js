var Auth = {
    check_login: function (req, res, next)
    {
        if (!req.session.logged_in) {
            return res.redirect('/login');
        }

        next();
    },
    is_admin: function (req, res, next)
    {
        if (!req.session.admin) {
            //req.flash('info', 'Maaf, Anda mengakses halaman terlarang')
            return res.redirect('/secretm')
        }
        next()
    },
    is_member: function (req, res, next)
    {
        if (req.session.admin) {
            //req.flash('info', 'Maaf, Anda mengakses halaman terlarang')
            return res.redirect('/secreta')
        }

        next()

    },
    is_login: function (req, res, next)
    {
        if (req.session.logged_in && req.session.admin) {
            return res.redirect('/admin')
        }else if (req.session.logged_in && !req.session.admin) {
            return res.redirect('/member')
        }else {
            next()
        }

    },
};

module.exports = Auth;
