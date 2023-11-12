const { Pool } = require('pg');

const pool = new Pool({
  user: 'senhorita_leal',
  host: 'localhost',
  database: 'dindin',
  password: 'estrela17',
  port: 5432,
});

module.exports = pool;
