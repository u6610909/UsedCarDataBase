const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "used_car_db",
  password: "Lnwza007x",
  port: 5432,
});

module.exports = pool;
