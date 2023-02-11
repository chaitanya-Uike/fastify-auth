const { getAllTasks, getUsersTasks, addTask } = require("../controllers/tasks");
const { verifyJWT } = require("../middleware/authorization");

const getAllTasksOpts = {
  schema: {
    response: {
      200: {
        tasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  preHandler: verifyJWT,
};

const getUsersTasksOpts = {
  schema: {
    params: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    },
    response: {
      200: {
        tasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  preHandler: verifyJWT,
};

const addTaskOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
      },
    },
  },
  preHandler: verifyJWT,
};

module.exports = (fastify, options, done) => {
  fastify.get("/", getAllTasksOpts, getAllTasks);

  fastify.get("/:id", getUsersTasksOpts, getUsersTasks);

  fastify.post("/addTask", addTaskOpts, addTask);

  done();
};
