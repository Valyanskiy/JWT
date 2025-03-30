const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;
const secret = 'aboba';

app.use(cors());
app.use(bodyParser.json());

let users = [];

const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secret, (err, decoded) => {
            if (err) return next(err);

            req.user = decoded;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

app.post('/register', (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const existingUser = users.find(user => user.name === username);
        if (existingUser) {
            return res.status(400).json({message: 'Username already exists'});
        }

        const newUser = {
            username,
            password: hashedPassword
        };

        users.push(newUser);
        res.status(201).json({message: 'User registered successfully!'});
    } catch (error) {
        res.status(500).json({message: 'Error registering user :('});
    }
})

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const user = users.find(user => user.name === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username' });
    }

    const  isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({username: user.username}, secret, {expiresIn: '1h'});
    res.json({ token });
})

// Защищенный маршрут
app.get('/protected', authJWT, (req, res) => {
    res.json({
        message: 'Protected data',
        user: req.user
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});