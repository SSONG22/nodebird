const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      //id가 기본적으로 들어있다
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      //RetweetId
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글임티 저장
      sequelize,
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); //작성자한테 속해있다 // post.addUser ,post.getUser
    db.Post.hasMany(db.Comment); //포스트 하나에 댓글 여러개 //post.addComments,
    db.Post.hasMany(db.Image); //post.addImages , post.getImages
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); //다 대 다 //post.addHashtags
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //post.addLikers, post.removeLikers
    //게시글 좋아요와 유저 => 다대다 as로 구별 user: 좋아요를 누른 사람들
    db.Post.belongsTo(db.Post, { as: "Retweet" }); //원본 게시물(1) -> 리트윗 (다) //post.addRetweet
  };
  return Post;
};
