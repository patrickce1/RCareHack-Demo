const Pool = require("pg").Pool;

const pool = new Pool({
    user: "nabendubiswas",
    host: "localhost",
    port: 5432,
    database: "postgretest"
});

module.exports = pool;
