const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //한글임티 저장
    }
  );
  Image.associatate = (db) => {
    db.Image.belongsTo(db.Post); // 1:다
  };
  return Image;
};
