const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글임티 저장
    }
  );
  Hashtag.associatate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  };
  return Hashtag;
};
