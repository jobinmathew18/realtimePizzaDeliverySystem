const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport){
    passport.use(new LocalStrategy({ usernameField: 'email'}, async(email, password, done) =>{

        //login
        //check if email exist
        const user = await User.findOne({email: email});
        // console.log(user);
        if(!user){                              //if user doesnot exist
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password, user.passsword).then(match => {
            if(match){
                // console.log(user.passsword);
                return done(null, user, {message: 'Logged in succesfully'})           //passing the user in parameter
            }
            return done(null, false, {message: 'Wrong username or password'})
        }).catch(err =>{
            return done(null, false, {message: 'Something went wrong'})
        })
    }))

    //storing user's id inside session
    passport.serializeUser((user, done)=>[
        done(null, user._id)
    ])

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user) =>{
            done(err, user)
        })
    })
}

module.exports = init