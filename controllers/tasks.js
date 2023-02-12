const models = require("../models");

async function getAllTasks(request, reply) {
  try {
    const { userId } = request.user;
    const tasks = await models.Task.findAll({ where: { UserId: userId } });

    reply.status(200).send({ tasks });
  } catch (error) {
    reply.status(500).send({ msg: "some error occurred" + error });
  }
}

async function getUsersTasks(request, reply) {
  try {
    const { id } = request.params;
    const user = await models.User.findByPk(id, { include: "Tasks" });

    if (!user) reply.status(404).send({ msg: "user not found" });

    reply.status(200).send({ tasks: user.Tasks });
  } catch (error) {}
}

async function addTask(request, reply) {
  try {
    const { userId } = request.user;
    const user = await models.User.findByPk(userId);
    await user.createTask({ ...request.body });

    reply.status(201).send({ msg: "task addded successfully" });
  } catch (error) {
    reply.status(500).send({ msg: "error occurred while adding Task" + error });
  }
}

module.exports = { getAllTasks, getUsersTasks, addTask };
