const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: true,
}));

const PORT = 3000;
const USERNAME = 'test';
const PASSWORD = '123456';

// Giriş sayfası (tarayıcı)
app.get('/dummy', (req, res) => {
  if (req.session.loggedIn) {
    res.send(`
      <h2>Hoş geldin, ${req.session.username}</h2>
      <form method="GET" action="/dummy/logout">
        <button type="submit">Çıkış Yap</button>
      </form>
    `);
  } else {
    res.send(`
      <h2>Login Sayfası</h2>
      <form method="POST" action="/dummy">
        <input name="username" placeholder="Kullanıcı adı"><br>
        <input name="pwd" type="password" placeholder="Şifre"><br>
        <button type="submit">Giriş</button>
      </form>
    `);
  }
});

// Giriş kontrolü (form + curl)
app.post('/dummy', (req, res) => {
  const username = req.body.username;
  const password = req.body.pwd || req.body.password;

  if (username === USERNAME && password === PASSWORD) {
    req.session.loggedIn = true;
    req.session.username = username;

    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('curl')) {
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
  console.log(`Dummy login sistemi: http://localhost:${PORT}/dummy`);
});

