const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Bet, { foreignKey: "userId" });
      this.hasMany(models.Message, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      balance: {
        type: DataTypes.DOUBLE,
      },
      password: DataTypes.STRING,
      wallet: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    { sequelize, modelName: "User" }
  );

  return User;
};
