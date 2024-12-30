const _ = require("lodash");
const express = require("express");
const bcript = require("bcrypt");
const bcrypt = require("bcrypt");
const { knex, generateAuthToken } = require("../database/db");
const {
  validateLogin,
  validatePassword,
} = require("../inputValidation/validateInput");
const router = express.Router();

//for logging in

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const error = validateLogin(req);

  if (error) return res.status(400).send(error.details[0].message);

  //todo remember to add try catch
  const user = await knex("user").where({ email }).first();

  if (!user) return res.status(400).send("invalid email or password ");

  const validPassword = await bcrypt.compare(password, user.password); //decoding password
  if (!validPassword) return res.status(400).send("invalid email or password ");
  const token = generateAuthToken(user.id);
  res.send(token);
});

router.put("/", async (req, res) => {
  const { email, type } = req.body;
  const { oldPassword, newPassword } = req.body.content;

  const error = validatePassword(req);

  if (error) return res.status(400).send(error.details[0].message);

  if (type === "change") {
    const user = await knex("user").where({ email }).first();
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (valid) {
      const salt = await bcript.genSalt(10); //salt the password
      const hashed = await bcript.hash(newPassword, salt); // hash it

      const result = await knex("user")
        .where({ email: email })
        .update({ password: hashed });

      return res.send(["working" + result]);
    }
  }

  if (type === "forgotten") {
    //todo fix this
    res.send("sending an email");
  }
  res.status(400).send("not the old password");
});

module.exports = router;
