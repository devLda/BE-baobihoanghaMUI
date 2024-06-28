// const mongoose = require("mongoose");
// const dbConnect = (app) => {
//   mongoose.connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   const connection = mongoose.connection;
//   connection.once("open", async () => {
//     console.info("Connected to DataBase");
//   });
// };

const mysql = require("mysql");
const dbConfig = require("./db.config");

// Create a connection to the database
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// open the MySQL connection
connection.on("connection", (error) => {
  if (error) {
    // console.error("error connecting: ", error)
    return
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;