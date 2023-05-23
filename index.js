const express = require('express');
const User = require('./models/user');
const sequelize = require('./config/config');
const path = require('path');
const routes = require('./routes/routes');

const app = express();

app.use(express.urlencoded({ extended: false }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images from the img folder
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


routes(app, User); // Pass the passport object as an argument

sequelize
  .sync()
  .then(() => {
    console.log('Database connected and tables created.');

    app.listen(3000, () => {
      console.log('Server started on port 3000.');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  