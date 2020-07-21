const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    //model에 init을 호출해야
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        //UserId: {}
        //PostId: {} 라는 컬럼을 만들어 준다.
      },
      {
        modelName: "Comment",
        tableName: "comments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글임티 저장
        sequelize, //연결 객체
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post); //belongsTo 의 역할
  }
};
//최신문법
