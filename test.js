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

async function update(id) {
    const result =  await knex("profile").where({ userID: id })

    

return result
}
    
update(45).then(e=>console.log(e))