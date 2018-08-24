const { User } = require('../models/User');

 var authUser = ((req, res , next) => {
      var token = req.header('x-auth');
     
   // return res.send(token)
      User.findByToken(token).then( (user) => {
       // console.log(user)
          if(!user){
              return Promise.reject();
          }
         
          req.user = user,
          req.token = token,
          req.type = 'user';
          next();
      })
      .catch( (e) => {
          res.status(401).send(e)
      });
     
 })

 module.exports = {authUser}