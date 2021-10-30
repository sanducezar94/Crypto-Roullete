const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    static associate(models) {
      this.hasMany(models.Bet, { foreignKey: "roundId" });
    }
  }
  Round.init(
    {
      result: {
        type: DataTypes.DOUBLE,
      },
    },
    { sequelize, modelName: "Round" }
  );

  return Round;
};
