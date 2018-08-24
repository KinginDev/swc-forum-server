const {Admin} = require('../models/Admin')


const authAdmin = ((req, res, next) => {
    const token = req.header('x-auth');

    Admin.findByToken(token).then( (user) => {
        if(!user) {
            return Promise.reject()
        }
            req.user = user;
            req.token = token;
            req.type = 'admin'

            next()
        }).catch( (e) => {
            res.status(401).send(e)
     
    })
})

module.exports = {authAdmin}