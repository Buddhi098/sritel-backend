const mysql = require('mysql2');

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost', // XAMPP MySQL host
  user: 'root',      // XAMPP MySQL default user
  password: '',      // Default password is empty
  database: 'sritel_user', // Your created database
});

// Connect to the MySQL database
db.connect((err) => 
{
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
