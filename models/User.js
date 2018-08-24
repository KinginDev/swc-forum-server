const  client = require('../config/apollo.js');
const   JWT = require('jsonwebtoken');
const  gql = require('graphql-tag');
const bcrypt = require('bcryptjs');

	function User({user}) {
		this.user = user;
	}

	User.prototype.generateAuthToken = function(id){
		console.log(id)
		var access = 'auth';
		const token =JWT.sign({
			id,
			access
		}, 'Maxwell').toString();

		return Promise.resolve(token)
	}

	User.prototype.findByCredentials = function (){
		const user = this.user
			return new Promise( (resolve, reject) => {
			
				
	 		//query to get the current user on grap.cool
				const FIND_BY_CREDENTIALS = gql
				 `query($email: String!) {
					User(email: $email) {
						id
						email
						password
					}
				}`;
				//the query variables
				const vars = {
					email: user.email
				}
			
				 client.query({
					query: FIND_BY_CREDENTIALS,
					variables: vars
				})
				.then((resp) => {
				if(!resp || resp.data.User == null)  {
					return reject('Invalid Credentials');
				}
			
				//decaler vars
					const id = resp.data.User.id;
					const password = resp.data.User.password;
					const email = resp.data.User.email;
					bcrypt.compare(user.password, resp.data.User.password, (err, res) => {
						if(res = true){
							return resolve({
								id,password,email
							});
						}else{
							return reject('Invalid Cred');
						}
					})
				}).catch(e =>   reject(e))
			})
	},
	User.prototype.createUser = function(){
		const user = this.user;

		//Promise
		return new Promise((resolve, reject) => {
			//Write Query
			const mutationQuery = gql `mutation createUser($email: String! $password: String $firstname: String $lastname: String $phone: String! ){
			createUser(email : $email password: $password firstname: $firstname lastname: $lastname phone: $phone){
					id
					email
					firstname
					lastname
					email
					phone
				}
			}`
			
			bcrypt.genSalt(10, function(err,salt){
				if(!err){
					bcrypt.hash(user.password, salt, function (err, hash) {
						console.log(hash);
						//return console.log(user.email);

						//Call Apollo Boost Client
						client.mutate({
							mutation: mutationQuery,
							variables: {
								firstname: user.firstname,
								lastname: user.lastname,
								email: user.email,
								phone: user.phone,
								password: hash,

							}
						}).then(res => {
							return resolve({
								id: res.data.createUser.id,
								email: res.data.createUser.email,
								firstname: res.data.createUser.firstname,
								lastname: res.data.createUser.lastname,
								phone: res.data.createUser.phone
							})
						}).catch(e => {
							return reject(e);
						})
					})
				}else{
					return reject(e);
				}
				
			})
		})
	}
	User.prototype.findByToken = function(token) {
		//decrypt the token
		let decoded;
		try{
			decoded =JWT.verify(token,'Maxwell');
		}catch(e) {
			return Promise.reject('Unauthorized')
		}
		
		//query graph.cool with the token
		const FIND_BY_TOKEN = gql `query($id: ID){
			User(id: $id){
				id
				firstname
				lastname
				email
				tokens{
					token
				}

			}
		}`;

		//query variables
		const variables = {
			id: decoded.id
		}

		return new Promise((resolve, reject) => {
			client.query({
				query: FIND_BY_TOKEN,
				variables
			})
			.then(({User}) => {
				resolve(User);
			}).catch(e => {
				reject(e)
			})
		});
	}

module.exports = {User} 