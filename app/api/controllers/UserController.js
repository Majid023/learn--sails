/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    "new": function (req, res) {
     
        res.view();
    },

    create: function(req, res, next) {

        User.create( req.params.all(), function userCreated(err ,user){
            if(err){
                
                console.log(err);        //return next(err);
                req.session.flash = {
                    err: err
                }

                
                return res.redirect('/user/new');
                
            }
            req.session.authenticated = true;
            req.session.User = user;
            //res.json(user);
            res.redirect("/user/show/"+user.id);
        });
    },
    
    show: function(req, res, next){
        User.findOne(req.param('id') , function foundUser(err, user){
            if(err) return next(err);
            if(!user) return next();
            res.view({
                user:user
            });
        });
    },
    index: function(req, res, next) {
        
        // console.log(new Date());
        // console.log(req.session.authenticated);
        User.find( function foundUsers (err, users) {
            if(err) return next(err);

            res.view({users: users});
        } );
    },

    edit: function(req, res, next){
       User.findOne(req.param("id"), function foundUser(err, user){

            if(err) return next(err);
            if(!user) return next();

            res.view({
                user:user
            });
       });  
    },

    update: function(req, res, next){

        User.update(req.param('id'),req.params.all(), function userUpdate(err){
            if(err) {
                console.log(err);
                console.log("update error");
                return res.redirect("/user/edit/"+req.param("id"));
            }
            res.redirect('user/show/'+req.param("id"));
        });
    },
    delete: function(req, res, next) {

        User.findOne(req.param("id"), function foundUser(err, user){
            if(err) return next(err);

            if(!user) return next('User doesn\'t exist.');

            User.destroy( req.param("id"), function userDestroyed(err){
                if(err) return next(err);
                res.redirect('/user');
            });
        });
    },

    subscribe: function(req, res, next) {
        User.find(function foundUser(err, users) {
            if(err) return next(err);
        
        User.subscribe(req.socket);
        User.subscribe(req.socket, users);
        res.send(200);
        });
    }
};



























