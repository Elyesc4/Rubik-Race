if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mariadb = require('mariadb/callback');

const conn = mariadb.createConnection({
  host: 'localhost', 
  user:'root', 
  password: process.env.MYSQL_PASSWORD.toString(),
  database: process.env.MYSQL_DB
});

var database = process.env.MYSQL_DB

conn.connect(err => {
  if (err) {
    console.log("not connected due to error: " + err);
  } else {
    console.log("connected ! connection id is " + conn.threadId);
    
    var sql = `DROP DATABASE ${database}`
    conn.query(sql, (err, res) => {
      if (err) throw err;
      console.log(`${database} successfully deleted`);
    })
    conn.end()
  }
});