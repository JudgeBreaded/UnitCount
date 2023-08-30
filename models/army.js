'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Army extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Army.init({
    title: DataTypes.STRING,
    faction: DataTypes.STRING,
    totalPoints: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Army',
  });
  return Army;
};