function auth(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login');            //if the user is not logged in then the user will redirect to /login.
}

module.exports = auth;