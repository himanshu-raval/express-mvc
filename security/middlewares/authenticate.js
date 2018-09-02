module.exports = {
    authenticateUser: function(req, res, next){
        //console.log('This is Custom Check:', Date.now())

        console.log("Session :",req.session.isLogin);
        if(req.session.isLogin == undefined){
            res.redirect('/');
        }else{

            next();
        }  
        
    }
}