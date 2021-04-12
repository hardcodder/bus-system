const { json } = require('body-parser');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports.getSignup = (req, res, next) => {
    let errMessage = "" ;
    res.render('auth/signup', {
        path: '/signup',
        title: 'SignUp' ,
        isAuthenticated : req.user ,
        errMessage : errMessage
    });
}

module.exports.postSignup = async(req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    try
    {
        if(password != confirmPassword)
        {
            // res.status(400).json({
            //     error: "Password does not match"
            // })
            let errMessage = "passwords not matched" ;
            return res.render("auth/signup.ejs" , 
            {
                path:'signup' ,
                title:'SIGNUP' ,
                isAuthenticated : req.user ,
                errMessage: errMessage
            });
        }
        else
        {
            const user = await User.findOne({email:email});
            if(user)
            {
                // res.status(400).json({
                //     err: "email already exist"
                // })
                let errMessage = "email already exists" ;
                return res.render("auth/signup.ejs" , 
                {
                    path:'signup' ,
                    title:'SIGNUP' ,
                    isAuthenticated : req.user ,
                    errMessage: errMessage
                });
            }
            else
            {
                console.log(password);
                password = await bcrypt.hash(password, 12);
                const user = new User({
                    name: name,
                    email: email,
                    password: password
                })
                await user.save();
                let errMessage = "" ;
                // res.status(200).json({
                //     message : "Signed in"
                // })
                res.render('auth/login.ejs', {
                    path: 'login',
                    title: 'LOGIN',
                    errMessage: errMessage ,
                    isAuthenticated : req.user
                })
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }
}

module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        title: 'Login' ,
        isAuthenticated : req.user
    });
}

module.exports.postLogin = async(req, res, next) => {
    // req.session.isLoggedIn = true;
    const email = req.body.email;
    const password = req.body.password;

    try 
    {
        const user = await User.findOne({email:email});
        if(user)
        {
            const isMatched = await bcrypt.compare(password, user.password);
            if(isMatched)
            {
                // res.status(200).json({
                //     message: "User logged in..."
                // })
                req.session.user = user;
                req.session.save((err) => {
                    res.redirect('/');
                })
            }
            else
            {
                // res.status(404).json({
                //     error: "email or password is wrong"
                // })
                let errMessage = "Email and Password doesn't match";
                return res.render('auth/login.ejs', {
                    path: '/login',
                    title: 'LOGIN',
                    errMessage: errMessage ,
                    isAuthenticated : req.user
                })
            }
        }
        else
        {
            // res.status(404).json({
            //     error : "User not found"
            // })
            let errMessage = "No user with this email is found , please sign in first";
            return res.render('auth/login.ejs', {
                path: '/login',
                title: 'LOGIN',
                isAuthenticated : req.user ,
                errMessage: errMessage
            })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.getLogout = (req , res , next) => {
    try
    {
        req.session.destroy( (err) => {
            res.redirect('/') ;
        })
    }
    catch(err)
    {
        next(err) ;
    }
}
