const {
    Sequelize
} = require('sequelize');

const sequelize = new Sequelize('ninjadb', 'admin', 'password', {
    host: 'ninjadb.coz9vf0nu9h9.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql'
});

module.exports = sequelize;