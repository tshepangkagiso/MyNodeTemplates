//1: Installation: npm install sqlite3

//2: Creating a Database:You can create a new SQLite database by simply creating a new file with the .sqlite extension.

//3: Using SQLite in Node.js: Here's a basic example of how you can use the sqlite3 package to interact with an SQLite database in a Node.js application:
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.sqlite');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)');
  
  db.run('INSERT INTO users (id, name) VALUES (?, ?)', [1, 'John'], (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('User inserted successfully.');
    }
  });
  
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
    }
  });
});

db.close();

/*In this example, you first import the sqlite3 module, create a connection to your database file, and then perform operations like creating tables, inserting data, and querying data.

Remember that this is a simplified example. In a real application, you might want to handle errors more gracefully, use asynchronous functions, and structure your code in a more organized manner. */


