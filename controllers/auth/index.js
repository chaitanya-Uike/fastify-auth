const models = require("../../models");
const redisClient = require("../../db/redis");
const JWT = require("jsonwebtoken");

async function registerController(request, reply) {
  try {
    const user = await models.User.create({ ...request.body });
    const { access_token, refresh_token } = user.getToken();
    // expire after 30 days
    redisClient.set(refresh_token, 1, "EX", 60 * 60 * 24 * 30);

    return reply.status(201).send({ access_token, refresh_token });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      reply.status(409).send({
        msg: "email already in use",
      });
    }

    reply.status(500).send({
      msg: "error occurred while registering user",
    });
  }
}

async function loginController(request, reply) {
  try {
    const { email, password } = request.body;
    const user = await models.User.findOne({ where: { email } });

    if (!user) reply.status(401).send({ msg: "Invalid Credentials" });

    const isPasswordMatching = user.comparePassword(password);

    if (!isPasswordMatching)
      reply.status(401).send({ msg: "Invalid Credentials" });

    const { access_token, refresh_token } = user.getToken();
    // expire after 30 days
    redisClient.set(refresh_token, 1, "EX", 60 * 60 * 24 * 30);

    reply.status(200).send({ access_token, refresh_token });
  } catch (error) {
    console.log(error);
    reply.status(500).send({
      msg: "error occurred while logging user in",
    });
  }
}

async function getToken(request, reply) {
  try {
    const { refresh_token } = request.body;

    const exists = await redisClient.exists(refresh_token);
    if (exists !== 1) reply.status(403);

    JWT.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (error, payload) => {
        if (error) return reply.status(403);

        const access_token = JWT.sign(
          { userId: payload.userId, username: payload.username },
          process.env.ACCESS_TOKEN_SECRET
        );

        reply.status(200).send({ access_token });
      }
    );
  } catch (error) {
    reply.send(500).send({ msg: "some error occurred" + error });
  }
}

module.exports = { loginController, registerController, getToken };
