const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

// const authRoute = require('./routes/auth');

const app = express();

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true
    })
    .then(() => console.log('mongo connected successfully'))
    .catch(err => console.log(err));

// middlewares
// morgan to get url path

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,            //access-control-allow-credentials:true
//     optionSuccessStatus: 200
// };

app.use(cors());

// routes middleware
// app.use('/api', authRoute);

// Or we can use autoloading routes as follows which takes out all the routes  
fs
    .readdirSync('./routes')
    .map(route => app.use('/api', require('./routes/' + route))
    );

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Running on port ', port);
});
