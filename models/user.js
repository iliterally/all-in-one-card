const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../config/config');

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  LocationOrAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  },
  BloodType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  gender: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  diabetes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  hyperTension: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  asthma: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  heartDisease: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  surgeries: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  drugs: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  Weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  Height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  other: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  snapchat: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  telegram: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null,
  },
  profile_image2: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null,
  },
  profile_image3: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null,
  },
  profile_image4: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null,
  },
  profile_image5: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null,
  },
  profile_image6: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null,
  },
}, {
  sequelize,
  modelName: 'User',
});


module.exports = User;