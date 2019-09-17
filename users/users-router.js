const express = require("express");
const Users = require("./users-model.js");
const bcrypt = require("bcryptjs");
const restricted = require("../auth/restricted-middleware.js");

const server = express();

server.get("/", (req, res) => {
  res.send("It's alive!");
});

server.post("/register", (req, res) => {
  let { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  Users.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You cannot pass" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/hash", (req, res) => {
  const name = req.query.name;
  // hash the name
  const hash = bcrypt.hashSync(name, 8); // use bcryptjs to hash the name
  res.send(`the hash for ${name} is ${hash}`);
});

server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({
          message: "You can check out anytime you like, but you can never leave"
        });
      } else {
        res.status(200).json({ message: "bye" });
      }
    });
  } else {
    res.status(200).json({ message: "alread logged out" });
  }
});

module.exports = server;
