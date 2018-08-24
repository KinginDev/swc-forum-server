const express  = require( 'express');
const _ =  require( 'lodash');
const {Admin} =  require( '../models/Admin.js');

const app = express.Router();
app.post('/signin', (req, res) => {
    var body = _.pick(req.body, ['email'], ['password']  );
    const admin = new Admin({admin:body});

    admin.findByCredentials().then( (resp) => {
          admin.generateAuthToken(resp.id).then( (token) => {
              res.header({'Authorization': token, 'Access-Control-Expose-Headers' : ['Authorization']}).send(resp)
         }).catch( (e) => {
             res.status(401).send(e)
         })
    }).catch(e => res.status(400).send(e))
});

app.post('/register', (req, res) => {
    var body = _.pick(req.body, ['email'], ['password']);
    const admin = new Admin({admin:body});
    admin.create().then( resp => {
        admin.generateAuthToken(resp.id).then( token => {
            res.header({'Authorization': token, 'Access-Control-Expose-Headers' : ['Authorization']}).send(resp)
        }).catch(e => res.status(400).json({ error: "MAX"}))
    }).catch(e => res.status(401).json({ error: 'An Error Occured'}))
})
module.exports = app;
