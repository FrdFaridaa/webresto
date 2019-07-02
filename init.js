var mongoose = require('mongoose');
var crypto = require('crypto');

var secret = 'rahasia';
var password = crypto.createHmac('sha256', secret)
    .update('rahasia123')
    .digest('hex');

console.log("Password: " + password);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/restaurant');

var User = require('./model/user');

User.find({username:'superadmin'}, function (err, user){
    if (user.length == 0)
    {
        var admin = new User({
            username: 'superadmin',
            email: 'users@example.com',
            password: password,
            firstname: 'super',
            lastname: 'admin',
            admin: true,
        });

        admin.save(function(err) {
            if (err) throw err;

            console.log('Admin is created!');
        });
    }
});

User.find({username:'supermember'}, function (err, user){
    if (user.length == 0)
    {
        var member = new User({
            username: 'supermember',
            email: 'member@example.com',
            password: password,
            firstname: 'super',
            lastname: 'member',
            admin: false,
        });

        member.save(function(err) {
            if (err) throw err;

            console.log('Member is created!');
        });
    }
});
