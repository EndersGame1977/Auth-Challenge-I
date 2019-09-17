const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const UsersRouter = require("./users/users-router.js");
const session = require("express-session");

const server = express();

const sessionConfig = {
  name: "chocochip", // would name cookie sid by default
  secret: process.env.SESSION_SECRET || "kee it secret, keep it safe",
  cookie: {
    maxAge: 1000 * 60 * 60, // in milliseconds
    secure: false, // true means only send cookie over https
    httpOnly: true // true means JS has no access to the cookie
  },
  resave: false,
  saveUninitialized: true, // GDPR compliance
  store: new knexSessionStore({
    knex: dbConnection,
    tablename: "knexsessions",
    sidfieldname: "sessionid",
    createtable: true,
    clearInterval: 1000 * 60 * 30 // clean out expired session data
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use("/api", UsersRouter);

module.exports = server;
