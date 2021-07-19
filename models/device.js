'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User,{
        foreignKey: 'user_id'
      });
    }
  };
  Device.init({
    user_id: DataTypes.INTEGER,
    perangkat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};