const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bet extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: "userId",
        },
      });
      this.belongsTo(models.Round, {
        foreignKey: {
          allowNull: false,
          name: "roundId",
        },
      });
    }
  }
  Bet.init(
    {
      amount: {
        type: DataTypes.DOUBLE,
      },
      color: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, modelName: "Bet" }
  );

  return Bet;
};
