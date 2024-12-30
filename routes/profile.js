const express = require("express");
const auth = require("../middleware/auth");
const { knex } = require("../database/db");
const { validateProfile } = require("../inputValidation/validateInput");
const route = express.Router();

route.post("/", auth, async (req, res) => {
  //noOfFollowers,noOfFollowings,noOfPost should be removed
  // const { fullName, profilePicture, gender, DOB, previledgeType } = req.body;

  const error = validateProfile(req);
  if (error) return res.status(400).send(error.details[0].message);

  req.body = { ...req.body, userID: req.user.id };

  // Remove keys with null or undefined values
  const filteredInput = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value != null)
  );

  try {
    // Insert into the database
    const [userId] = await knex("profile").insert(filteredInput);
    res.send(["User profile inserted with ID:" + userId]);
  } catch (error) {
    res
      .status(400)
      .send(["Error creating profile, it might already have been created"]);
  }
});

route.get("/", auth, async (req, res) => {
  try {
    const rows = await knex("profile").where({ userID: req.user.id });
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No profile found for this user" });
    }
  } catch (err) {
    res.status(500).json({ message: "an error occoured ", error: err });
  }
});

route.put("/", auth, async (req, res) => {
  const error = validateProfile(req);
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
    const result = await knex("profile")
      .where({ userID: req.user.id }) // Update where the id matches
      .update(filteredInput);

    console.log(req.user.id, filteredInput);
    res.send("Update sucessful" + result.toString());
  } catch (error) {
    res.status(400).send("Error updating profile:");
  }
});

module.exports = route;
