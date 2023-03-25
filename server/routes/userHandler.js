const express = require("express");
const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");

const mongoUtil = require("../db/mongoUtil.js");
const db = mongoUtil.getDb();

const COLLECTION_USER = "USERS";
/** 
  GET - '/user'

  get user's general information
*/
// router.get("/", (req, res) => {
//   var collection = COLLECTION_USER + req.body.user;
//   console.log("get from user collection", collection);
//   db.collection(collection)
//     .find()
//     .toArray((err, result) => {
//       if (err) return console.log(err);
//       res.status(200).json(result);
//     });
// });

/**
 * Register a user
 */
router.post("/register", (req, res) => {
  console.log(req.body);
  const username = req.body.user;
  const password = req.body.password;
  console.log(username + ":" + password);

  if (!username || !password) {
    res.status(400).send({
      status: 1,
      message: "Username/Password cannot be null.",
    });
  }

  // Check if the username has been taken
  db.collection(COLLECTION_USER).findOne({ user: username }, (err, results) => {
    if (err) throw err;
    if (results) {
      console.log("Register Result: ", results);
      console.log("Username is already taken.");
      return res
        .status(400)
        .send({ status: 1, message: "Username is already taken." });
    } else {
      // Encrypt the password by hashing
      const saltsRound = 12;
      const encryptedPassword = bcrypt.hashSync(password, saltsRound);

      let data = {
        user: username,
        password: encryptedPassword,
      };

      db.collection(COLLECTION_USER)
        .insertOne(data)
        .then((result) => {
          console.log("User successfully created: " + result.insertedId);
        })
        .catch((err) => {
          console.error(err || `Error occurred when inserting data=${data}.`);
        });

      // res.redirect("/");
      res
        .status(201)
        .send({ status: 0, message: "Account successfully created." });
      return;
    }
  });
});

/**
 * Log in a user
 */
router.post("/login", (req, res) => {
  console.log(req.body);
  const username = req.body.user;
  const password = req.body.password;
  console.log(username + ":" + password);

  // Authenticate the User
  const query = { user: username };
  db.collection(COLLECTION_USER).findOne(query, (err, results) => {
    if (err) throw err;
    console.log("results: ", results);

    if (results) {
      console.log("User exists");

      // Check password
      const compareResult = bcrypt.compareSync(password, results.password);
      if (!compareResult) {
        res.status(401).send({ message: "Invalid username or password" });
        return;
      } else {
        console.log("User log in success");
        req.session.user = username;
        res.redirect(200, "/"); // TODO: login success, direct to homepage
      }
    } else {
      // Register the user
      console.log("User does not exist");

      res.status(404).send({ message: "User does not exist" });
      return;
    }
  });
});

/**
 * Authenticate the user is logged in
 */
router.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Auth: " + req.user.user);
    res.status(200).send({ success: true, message: "OK", user: req.user.user });
  } else {
    console.log("No auth");
    res.status(401).send({ success: false, message: "BAN" });
  }
});

/**
 * Log out a user
 */
router.get("/logout", (req, res) => {
  console.log("User logged out: ", req.session);
  
  // Proceed only if there is an active session
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.log("ERROR");
        console.error(err);
        res.status(400);
      } else {
        res.redirect(200, "/");
      }
    });
  }
});

module.exports = router;
