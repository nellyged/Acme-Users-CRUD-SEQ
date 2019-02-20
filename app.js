const express = require('express');
const app = express();
const morgan = require('morgan');
const {
  syncAndSeed,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('./db');

app.use(morgan('dev'));

// parses url-encoded bodies
app.use(express.urlencoded({ extended: false }));

// parses json bodies
app.use(express.json());

const renderPage = users => {
  return `
      <html>
      <head>
        <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css' />
      </head>
      <body>
        <div class='container'>
        <h1>Acme Users CRUD-SEQ</h1>
        <ul>
          ${users
            .map(user => {
              return `
              <li>
                <a href='/users/${user.id}'>
                ${user.firstName} ${user.lastName}
                </a>
                <form method="GET" action="/users/${user.id}/delete">
                <button type="submit" class="btn btn-primary">Delete</button>
                </form>
              </li>
            `;
            })
            .join('')}
        </ul>
        <div id = 'tabContent'>
        <form method="POST" action="/users">
          <input
            name="first"
            type="text"
          />
          <input
            name="last"
            type="text"
          />
          <button type="submit" class="btn btn-primary">Create</button>
          <a href="/users">Cancel</a>
        </form>
        </div>
      </div>
      </body>
      </html>
    `;
};

const renderPageUser = (users, usr) => {
  return `
      <html>
      <head>
        <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css' />
      </head>
      <body>
        <div class='container'>
        <h1>Acme Users CRUD-SEQ</h1>
        <ul>
          ${users
            .map(user => {
              return `
              <li>
                <a href='/users/${user.id}'>
                ${user.firstName} ${user.lastName}
                </a>
                <form method="GET" action="/users/${user.id}/delete">
                <button type="submit" class="btn btn-primary">Delete</button>
                </form>
              </li>
            `;
            })
            .join('')}
        </ul>
        <div id = 'tabContent'>
        <form method="POST" action="/users/${usr.id}">
          <input
            name="first"
            type="text"
            value=${usr.firstName}
          />
          <input
            name="last"
            type="text"
            value=${usr.lastName}
          />
          <button type="submit" class="btn btn-primary">Update</button>
          <a href="/users">Cancel</a>
        </form>
        </div>
      </div>
      </body>
      </html>
    `;
};

app.get('/', (req, res, next) => {
  res.redirect('/users');
});

app.post('/users', (req, res, next) => {
  createUser(req.body.first, req.body.last)
    .then(() => {
      res.redirect('/users');
    })
    .catch(next);
});

app.get('/users', (req, res, next) => {
  getUsers()
    .then(users => {
      const usersArr = [];
      Object.keys(users[0]).forEach(key => {
        usersArr.push(users[0][key]);
      });
      res.send(renderPage(usersArr));
    })
    .catch(next);
});

app.post('/users/:id', (req, res, next) => {
  console.log('update');
  updateUser(req.body.first, req.body.last, parseInt(req.params.id))
    .then(() => {
      res.redirect('/users');
    })
    .catch(next);
});

app.get('/users/:id', (req, res, next) => {
  getUsers(parseInt(req.params.id))
    .then(users => {
      const usersArr = [];
      Object.keys(users[0]).forEach(key => {
        usersArr.push(users[0][key]);
      });
      console.log(`Getting User ${users[1].firstName}`);
      res.send(renderPageUser(usersArr, users[1]));
    })
    .catch(next);
});

app.get('/users/:id/delete', async (req, res, next) => {
  deleteUser(parseInt(req.params.id))
    .then(() => {
      res.redirect('/users');
    })
    .catch(next);
});

module.exports = app;
