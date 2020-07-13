const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      //UserId: {}
      //PostId: {} 라는 컬럼을 만들어 준다.
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글임티 저장
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post); //belongsTo 의 역할
  };
  return Comment;
};
