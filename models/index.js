const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

const models = {
  User: require("./user")(sequelize, Sequelize.DataTypes),
  Task: require("./task")(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].hasOwnProperty("associate")) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
