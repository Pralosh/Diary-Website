const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

const { checkAuth } = require("./middleware/auth.js");

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Routes
app.use("/api/auth", require("./auth/route.js"));
app.use("/api/diary", require("./diary/route.js"));

app.get('/', checkAuth, (req, res) => res.render('home'));

app.get('/login', (req, res) => res.render('login')); //renders login ejs
app.get('/register', (req, res) => res.render('register'));
app.get('/logout', (req, res) => {
    req.session.destroy(() => console.log('user logged out.'));
    res.redirect('/login');
});

app.get('/profile', checkAuth, (req, res) => res.render('profile'));
app.get('/diary', checkAuth, (req, res) => res.render('diary'));

app.listen(3000,() => {
    console.log("Server started on http://localhost:3000")});