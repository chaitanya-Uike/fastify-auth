const models = require("../../models");

async function registerController(request, reply) {
  try {
    const user = await models.User.create({ ...request.body });
    const token = user.getToken();

    return reply.status(201).send({ access_token: token });
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

    const token = user.getToken();
    reply.status(200).send({ access_token: token });
  } catch (error) {
    console.log(error);
    reply.status(500).send({
      msg: "error occurred while logging user in",
    });
  }
}

module.exports = { loginController, registerController };
