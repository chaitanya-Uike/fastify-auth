const {
  loginController,
  registerController,
  getToken,
} = require("../controllers/auth");

const registerOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
        },
        username: {
          type: "string",
          minLength: 2,
          maxLength: 25,
        },
        password: {
          type: "string",
          minLength: 6,
        },
      },
      required: ["email", "username", "password"],
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        access_token: {
          type: "string",
        },
        refresh_token: {
          type: "string",
        },
      },
    },
  },
};

const loginOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
        },
        password: {
          type: "string",
        },
      },
      required: ["email", "password"],
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        access_token: {
          type: "string",
        },
        refresh_token: {
          type: "string",
        },
      },
    },
  },
};

const tokenopts = {
  schema: {
    body: {
      type: "object",
      properties: {
        refresh_token: {
          type: "string",
        },
      },
      required: ["refresh_token"],
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        access_token: {
          type: "string",
        },
      },
    },
  },
};

function authRoute(fastify, options, done) {
  fastify.post("/register", registerOpts, registerController);
  fastify.post("/login", loginOpts, loginController);
  fastify.post("/token", tokenopts, getToken);

  done();
}

module.exports = authRoute;
