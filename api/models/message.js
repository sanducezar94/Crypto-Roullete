const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: "userId",
        },
      });
    }
  }
  Message.init(
    {
      message: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, modelName: "Message" }
  );

  return Message;
};
