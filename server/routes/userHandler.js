const express = require("express");
const router = express.Router();

const mongoUtil = require("../db/mongoUtil.js");
const db = mongoUtil.getDb();

/** 
  GET - '/user'

  get user's general information
*/
router.get("/", (req, res) => {
  var collection = "user" + req.user.user;
  console.log("get from user collection", collection);
  db.collection(collection)
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.status(200).json(result);
    });
});

router.get("/login", (req, res) => {
  var collection = "user" + req.user.user;

  console.log(req.body);
  const username = req.body.user;
  const password = req.body.password;
  console.log(username + ":" + password);
  
  console.log("get from user collection", collection);
  db.collection(collection)
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.status(200).json(result);
    });
});

router.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Auth: " + req.user.user);
    res.status(200).send({ success: true, message: "OK", user: req.user.user });
  } else {
    console.log("No auth");
    res.status(401).send({ success: false, message: "BAN" });
  }
});

router.get("/logout", (req, res) => {
  console.log("User logged out: ", req.session);
  req.session.destroy((err) => {
    console.error(err);
  });
  res.redirect("/");
});

module.exports = router;
