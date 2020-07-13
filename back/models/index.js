const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"; //||기본값
const config = require("../config/config")[env]; //development 를 가져와라
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
//sequelize가 노드와 mysql을 연결시켜준다
//sequelize 객체에 연결 정보가 담긴다

db.Comment = require("./comment")(sequelize, Sequelize); //require 하면서 함수 실행
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);

//assoiciate 연결
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
