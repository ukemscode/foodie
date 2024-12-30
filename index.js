const config = require("config");
const express = require("express");
const app = express();

const users = require("./routes/users");
const auth = require("./routes/Auth");
const userProfile = require("./routes/profile");

app.use(express.json());
app.use("/api/user", users);
app.use("/api/auth", auth);
app.use("/api/profile", userProfile);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR jwtPrivateKey is not defined set it by typing 'set foodie_jwtPrivateKey'");
  process.exit(1);
}

const PORT = 3000;

app.listen(PORT, () => console.log(`listening ${PORT}`)); 
