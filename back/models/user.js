const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // MySQL에서는 users 테이블 생성
      //엑셀에 적어준다 생각하고
      // id: {}, //id는 고유한 값을 주는데 mysql에서 자동으로 넣어주기때문에 안넣어주도됨
      email: {
        //데이터 : 가로줄 : 로우
        type: DataTypes.STRING(30), //STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, //필수
        unique: true, //고유한 값
      }, //세로줄 : 컬럼
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      //user 모델에 대한 세팅
      charset: "utf8",
      collate: "utf8_general_ci", //한글저장
      sequelize,
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    // 사용자와 게시글 좋아요 와의 관계 => 다대다, 중간 테이블의 이름 : Like, Post별칭 Liked
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };
  return User;
};
