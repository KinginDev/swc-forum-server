const express = require('express');
const {User}= require( '../models/User.js')
const _ = require('lodash');
const {authUser} = require('../middlewares/authUser')

//ES6 Import
const cors = require('cors')
const app = express.Router();

//configure cors
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/me',authUser, (req , res) => {
 res.send(req.user)
})
//user sign in Route 
app.post('/signin', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
  	const user = new User({user: body})
    user.findByCredentials().then( (resp) => {
     	user.generateAuthToken(resp.id).then((token )=> {
			res.header({'Authorization': token, 'Access-Control-Expose-Headers' : ['Authorization']}).send(resp)
		}).catch(e => res.status(400).send(e))
		
    }).catch( e => { res.status(401).send(e);  console.log(e);
	})
})

app.post('/signup', (req, res) => {
	const body = _.pick(req.body,['firstname','lastname', 'email', 'password', 'phone']);
	const user = new User({user: body});
	user.createUser().then(resp => {
		user.generateAuthToken(resp.id).then(token => {
			res.header({'Authorization' : token, 'Access-Control-Expose-Headers': ['Authorization']}).send(resp)
		}).catch(e => {
			message : e
		})
	}).catch(e => {
		res.status(400).send({
			message: e.message,
		})
	})
	
	
})

module.exports = app;
