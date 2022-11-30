function guest(req, res, next){
    if(!req.isAuthenticated()){                        //if user is not logged in then proceed the user to further login and register processes.
        return next();
    }

    return res.redirect('/');                         //if user is logged in then restrict it from login and register routes. And redirect it to home page 
                                                      //whenever the user wants to access the login and register routes.
}

module.exports = guest;




