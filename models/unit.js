'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Unit.belongsTo(models.Army, {
        foreignKey: 'armyId',
        onDelete: 'CASCADE'
      })
    }
  }
  Unit.init({
    unitName: DataTypes.STRING,
    unitType: DataTypes.STRING,
    unitTier: DataTypes.INTEGER,
    unitPoint: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Unit',
  });
  return Unit;
};