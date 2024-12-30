
const connect = require("knex");
const config=require('config')
const jwt=require('jsonwebtoken');

const knex = connect({
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "foodie",
    },
  });

  generateAuthToken=function(userID){
    const token=jwt.sign({id:userID},config.get('jwtPrivateKey'));
    return token
  }

module.exports={knex,generateAuthToken};