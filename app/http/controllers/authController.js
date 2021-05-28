const User = require('../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : req.user.role === 'seller' ? '/' : '/customer/orders'
    }

    //Function for save Seller Registration data into the Database
    async function saveSeller(username, email, password, User, req, res) {
        //Hash password
        const hashPassword = await bcrypt.hash(password, 10)

        //Create a new user
        const user = new User({
            role: 'seller',
            name: username,
            email,
            password: hashPassword
        })

        user.save()
            .then((user) => {
                return res.redirect('/sellerLog')
            })
            .catch((err) => {
                console.log(err);
                req.flash('error', 'Something went wrong')
                return res.redirect('/sellerReg')
            })
    }


    return {
        //Login routes
        login(req, res) {
            res.render('auth/login')
        },

        postLogin(req, res, next) {
            const { email, password } = req.body
                // Validate request 
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req, res, next)
        },

        //register routes
        register(req, res) {
            res.render('auth/register')
        },

        async postRegister(req, res) {
            const { name, email, password } = req.body

            //Validate request
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //Check if email exist
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            //Hash password
            const hashPassword = await bcrypt.hash(password, 10)

            //Create a new user
            const user = new User({
                name,
                email,
                password: hashPassword
            })

            user.save()
                .then((user) => {
                    return res.redirect('/login')
                })
                .catch((err) => {
                    console.log(err);
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/register')
                })
        },

        //Seller Registration
        sellerReg(req, res) {
            res.render('auth/sellerReg')
        },

        async postSellerRegister(req, res) {
            // res.render('auth/sellerReg')
            const { username, email, password } = req.body

            //Validate request
            if (!username || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('username', username)
                req.flash('email', email)
                return res.redirect('/sellerReg')
            }

            //Check if email exist
            const result = await User.exists({ email: email });
            if (result) {
                const emailUse = await User.find({ email: email })
                if (emailUse) {
                    // console.log(emailUse[0].role);
                    const role = emailUse[0].role;
                    if (role === 'customer' || role === 'admin') {
                        saveSeller(username, email, password, User, req, res)

                    } else {
                        req.flash('error', 'Email already taken')
                        req.flash('username', username)
                        return res.redirect('/sellerReg')

                    }
                } else {
                    req.flash('error', 'Email already taken')
                    req.flash('username', username)
                    return res.redirect('/sellerReg')

                }
            } else {
                saveSeller(username, email, password, User, req, res)

            }
        },

        //Seller Login
        sellerLog(req, res) {
            res.render('auth/sellerLog')
        },

        postSellerLog(req, res, next) {
            const { email, password } = req.body
                // Validate request 
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/sellerLog')
            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/sellerLog');
                }
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req, res, next)
        },

        logout(req, res) {
            req.logout();
            return res.redirect('/login');
        }
    }
}

module.exports = authController