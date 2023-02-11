const fastify = require("fastify")();
const models = require("./models");
require("dotenv").config();

const PORT = process.env.PORT || 5050;

fastify.register(require("./routes/authRoute"), { prefix: "/auth" });

const start = async () => {
  try {
    await fastify.listen({ port: PORT }, () =>
      console.log(`[server]: http://localhost:${PORT}`)
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

models.sequelize
  .sync({ alter: true })
  .then(() => {
    start();
    return models.User.findAll();
  })
  .then((users) => {
    users.forEach((user) => {
      console.log(user.toJSON());
    });
  })
  .catch((err) => [
    console.log("some error occured while connecting to DB", err),
  ]);
