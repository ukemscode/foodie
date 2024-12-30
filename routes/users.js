const _ = require("lodash");
const express = require("express");
const joi = require("joi");
const { knex, generateAuthToken } = require("../database/db");
const { validateUser,validateUpdatedUser } = require("../inputValidation/validateInput");
const auth=require('../middleware/auth')
const bcript = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  const error = validateUser(req);

  if (error) return res.status(400).send(error.details[0].message);

  //todo remember to add try catch
  const user = await knex("user")
    .where({ username })
    .orWhere("email", email)
    .first();

  if (!user) {
    const salt = await bcript.genSalt(10); //salt the password
    const hashed = await bcript.hash(password, salt); // hash it

    const user = await knex("user").insert({
      username: username,
      email: email,
      password: hashed,
      phonenumber: phoneNumber,
    });

    const token = generateAuthToken(user);

    return res
      .header("x-auth-token", token)
      .send(["sucessful", _.pick(req.body, ["username", "email"])]);
  }

  res.status(400).send("username or email already registered");
});

router.get("/",auth, async (req, res) => {
  try {
    const rows = await knex("user").where({ id: req.user.id });
    if (rows.length > 0) {
      res.json(_.pick(rows[0], ["username", "email","phoneNumber"]));
    } else {
      res.status(404).json({ message: "No profile found for this user" });
    }
  } catch (err) {
    res.status(500).json({ message: "an error occoured ", error: err });
  }
});

router.put("/",auth,async (req, res) => {
  const error = validateUpdatedUser(req);
  if (error) return res.status(400).send(error.details[0].message);

  // Remove keys with null or undefined values
  const filteredInput = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value != null)
  );

  if (Object.keys(filteredInput).length === 0) {
    return res.send(["no valid field"]);
  }
  try {
    // Perform the update
    const result = await knex("user")
      .where({ id: req.user.id }) // Update where the id matches
      .update(filteredInput);

    res.send("Update sucessful" + result.toString());
  } catch (error) {
    res.status(400).send("Error updating "+error);
  }
});

router.delete("/",auth,async (req, res) => {
  try {
    const result = await knex('user').where({ id: req.user.id }).del();
    if (result) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'No user found with the specified ID' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

module.exports = router;
