'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.track, { foreignKey: 'trackId'});
    }
  };
  Artist.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    spotifyId: DataTypes.STRING,
    trackId: {
      type: DataTypes.INTEGER,
      references: 'tracks',
      referencesKey: 'id'
    },
    href: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'artist',
  });
  return Artist;
};