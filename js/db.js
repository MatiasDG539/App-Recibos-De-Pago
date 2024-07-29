const {
    createPool
} = require('mysql');

const pool = createPool({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "client"
})

pool.query('SELECT * FROM clients', (err, result, fields) => {
    if(err){
        return console.log(err);
    }
    return console.log(result)
})

module.exports = pool;