const express = require('express');
const app = express();
const env = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path')
const sql_port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json())
env.config();

//front
app.use(express.static(path.join(__dirname, '../public')));

require('./routes/user/user')(app, bcrypt);
require('./routes/todos/todos')(app, bcrypt);
require('./routes/auth/auth')(app, bcrypt);

app.listen(sql_port, function() {
  console.log(`Epytodo app listening on port ${sql_port}`);
});
