if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mariadb = require('mariadb/callback');
var tabelName = "users"
var database = process.env.MYSQL_DB

const conn = mariadb.createConnection({
    host: 'localhost', 
    user:'root', 
    password: process.env.MYSQL_PASSWORD.toString(),
});

conn.connect(err => {
    if (err) {
        console.log("not connected due to error: " + err);
    } else {
        console.log("connected ! connection id is " + conn.threadId);
        
    var sql = `
    CREATE DATABASE ${database};
    use ${database};
    CREATE TABLE ${tabelName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255)
    )`
    conn.query(sql, (err) => {
        if (err) throw err;
        console.log(`${database} successfully created`);
    });
        conn.end()
    }
});