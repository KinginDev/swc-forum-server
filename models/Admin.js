
const JWT = require('jsonwebtoken');
const gql = require('graphql-tag');
const client = require( '../config/apollo.js');
const bcryptjs = require('bcryptjs');


//The constructor function
function Admin({admin}){
    this.admin = admin;
}


Admin.prototype.generateAuthToken = function(id) {
    var access = 'auth';
    //generate auth token 
    var token = JWT.sign({
        id,
        access
    },'Maxwell').toString();

    return Promise.resolve(token);
    
}



Admin.prototype.findByCredentials = function() {
    const admin = this.admin
    console.log(admin)
    //query to find the current user
    const GET_ADMIN = gql `query($email : String!){
        Admin(email: $email){
            email
            id
        }
    }`;
    //send the request and return a promise
    return new Promise((resolve, reject) => {
       client.query({
            query: GET_ADMIN,
            variables:{
                email: admin.email
            }
        }).then( resp => {
           return resolve({
                id: resp.data.Admin.id,
                email: resp.data.Admin.email
            })
        }).catch(e => {
                return reject('An Error Occured')
            })
    })   
}

Admin.prototype.create = function() {
   const admin = this.admin;
   console.log(admin)
    return new Promise((resolve, reject) => {
       const CREATE_ADMIN = gql `mutation($email: String! $password: String!){
            createAdmin(email: $email password: $password){
                id
                email
                password
            }
           }`
 bcryptjs.genSalt(10,( err, salt) => {
    bcryptjs.hash(admin.password,salt, (err, hash)=> {
       client.mutate({
                mutation: CREATE_ADMIN,
                variables: {
                    email: admin.email,
                    password: hash
                }
            }).then(resp => { 
                return resolve({
                    id: resp.data.createAdmin.id,
                    email : resp.data.createAdmin.email
                })
            }).catch( e => {
                return reject(e);
            })
         })
        })  
    })
   
};


module.exports = {Admin}