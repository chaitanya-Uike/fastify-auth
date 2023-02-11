const JWT = require("jsonwebtoken");

function verifyJWT(request, reply, done) {
  try {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) throw new Error("No authorization token provided");

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) throw new Error("Authentication failed");

      request.user = user;

      done();
    });
  } catch (error) {
    reply.status(401).send(error);
  }
}

module.exports = { verifyJWT };
