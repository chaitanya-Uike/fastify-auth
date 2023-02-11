const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    getToken() {
      const payload = { userId: this.id, username: this.username };
      const access_token = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15s",
      });
      const refresh_token = JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET);

      return { access_token, refresh_token };
    }

    async comparePassword(candidatePassword) {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    }

    static associate(models) {
      User.hasMany(models.Task);
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 25],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          // setters don't allow async funcs, maybe I can use hooks for hashing instead
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue("password", hash);
        },
      },
    },
    {
      sequelize,
    }
  );

  return User;
};
