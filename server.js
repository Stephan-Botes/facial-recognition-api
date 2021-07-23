const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const postgresDB = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('The facial-recognition-api is running.')
});

app.post('/signin', signin.handleSignin(postgresDB, bcrypt))

app.post('/register', (req, res) => {
    register.handleRegister(req, res, postgresDB, bcrypt);
});

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, postgresDB);
});

app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res);
});

app.put('/image', (req, res) => {
    image.handleImage(req, res, postgresDB);
});

// Server start on port 8000
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});