const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

const USERNAME = 'test';
const PASSWORD = '123456';


app.get('/dummy', (req, res) => {
  if (req.session.loggedIn) {
    res.send(`
      <h2>Hoş geldin, ${req.session.username}</h2>
      <form method="GET" action="/dummy/logout">
        <button type="submit">Çıkış Yap</button>
      </form>
    `);
  } else {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  }
});


app.post('/dummy', (req, res) => {
  const username = req.body.username;
  const password = req.body.pwd || req.body.password;

  if (username === USERNAME && password === PASSWORD) {
    req.session.loggedIn = true;
    req.session.username = username;

    const ua = req.headers['user-agent'] || '';
    if (ua.includes('curl')) {
      res.send('Giriş başarılı, session başladı.');
    } else {
      res.redirect('/dummy');
    }
  } else {
    res.status(401).send('Geçersiz kullanıcı adı veya şifre.');
  }
});

// Logout
app.get('/dummy/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/dummy');
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/dummy adresinden giriş ekranına erişebilirsiniz`);
});
