var bcrypt = require('bcrypt');

module.exports = {

    'new' : function(req, res){

        // var oldDateObj = new Date();
        // var newDateObj = new Date(oldDateObj.getTime() + 60000);
        // req.session.cookie.expires = newDateObj;
        // req.session.authenticated = true;
        // console.log(req.session);
    
        res.view("session/new");
    
    },

    create: function(req, res, next){

        if(!req.param('email') || !req.param('password')) {

            var usernamePasswordRequiredError = [{name: 'userPasswordRequired',message: 'You must enter both email and password'}];
 
            req.session.flash = {
                err: usernamePasswordRequiredError
            }

            res.redirect('/session/new');
            return;
        }

        User.findOneByEmail(req.param('email'), function foundUser(err, user) {
            if(err) return next(err);

            //if no user found
            if(!user) {
                var userNotFoundError = [{name: 'noUser', message: "Invalid user or password"}];

                req.session.flash = {
                    err: userNotFoundError
                }
                res.redirect('/session/new');
                return;
            }

            bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
                if(err) return next(err);

                if(!valid) {
                    var passwordNotMatchError = [{name: 'passwordNotMatch', message: 'Invalid user or password'}];
                    req.session.flash = {
                        err: passwordNotMatchError
                    }

                    res.redirect('/session/new');
                    return;
                }

                req.session.authenticated = true;
                req.session.User = user;
                user.online = true;

                user.save( function(err, user){
                    if(err) return next(err);

                    User.publishUpdate(user.id,{
                        loggedIn:true,
                        id:user.id
                    });

                    if(req.session.User.admin) {
                        res.redirect("/user");
                        return;
                    }

                    res.redirect('/user/show/' + user.id);
                });
            });
        });
    
    },
    destroy: function(req, res, next) {

        User.findOne(req.session.User.id, function foundUser(err, user) {
            var userId = req.session.User.id;
            User.update(userId,{
                online: false
            }, function(err){
                if(err) return next(err);


                User.publishUpdate(user.id,{
                    loggedIn: false,
                    id: user.id
                })
            });
        });
        req.session.destroy();
        res.redirect('/session/new');
    }
}