const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController(){
    return {
        login (req,res){
            res.render('auth/login');
        },

        postLogin(req, res, next){
            passport.authenticate('local', (err, user, info) =>{      //(err, user, info) is basically passing parameters of "done" which is in passport.js
                if(err){
                    req.flash('error', info.message);           //info.message is used to display {message: " "} from passport which is inside passport.js
                    return next(err);
                }

                if(!user){              //if you see in passport.js, wherever the parameter contains false that means that there is no user. 
                    req.flash('error', info.message);   //hence info.message will flash only those messages where there is no user or where there is false inside parameter.
                    return res.redirect('/login');
                }

                req.logIn(user, (err) =>{
                    if(err){
                        req.flash('error', info.message);             //it will flash those error messages which occurs while loging in.
                        return next(err);
                    }

                    return res.redirect('/'); 
                })
            })(req, res, next)
        },
 
 
        register (req,res){
            res.render('auth/register');
        },


        async postRegister(req,res){
            // console.log(req.body);
            const { name, email, password} = req.body;
            // console.log(name)
            if(!name || !email || !password){
                req.flash('error', 'All fields are required');       //it is key value pair. error is key and "all fields are required" is value of the key.
                req.flash('name', name);                             //already written name and email will again appear in the input box
                req.flash('email', email);
                return res.redirect('/register');
            }

            //check if email exists
            User.exists({email: email}, (err, result) =>{
                if(result){
                    req.flash('error', 'Email already exists')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
     
            //Create a user
            const user = new User({
                name: name,
                email: email,
                passsword: hashedPassword
            })
            user.save().then((user)=>{
                return res.redirect('/login');
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
 
        },

        logoutPost(req, res){
            req.logout(function(err){           //req.logout() is a passport method
                if(err) throw err;
            })                              
            return res.redirect('/login');
        }
    }
}

module.exports = authController;