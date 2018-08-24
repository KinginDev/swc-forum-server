const express = require('express');
const bodyParser = require('body-parser')

const index = require('./routes/index.js');
const admin = require('./routes/admin.js');

const cors = require('cors');

const app = express();
const port = process.on.NODE_ENV || 7000;

var path = require('path');



app.use(bodyParser.json());
app.use('/', index); 
app.use('/admin', admin);

app.use(cors({
    allowedheaders: ['Content-Type', 'Authorization', 'Access-Control-Expose-Headers', 'Access-Control-Allow-Origin','Access-Control-Allow-Methods']
}))




app.listen(port, () => {
    console.log(`Server running on port ${port} `)
});