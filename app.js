const express = require("express");
const jwt = require("jsonwebtoken")
const { pool } = require("./db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const { generateAccessToken } = require("./middleware/auth");
const res = require("express/lib/response");
const app = express();

const PORT = process.env.PORT || 4000;

// const initializePassport = require("./passportConfig");

// initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.set("view engine", "ejs");

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  //   res.render("index");
  console.log("index")
});

app.post("/users/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const userExist = await new Promise((resolve, reject) => {
      pool.query('SELECT * from users1 where email = ($1)', [email], (error, result) => {
        if (error) {
          throw error;
        }
        resolve(result.rowCount)
      })
    })
    if (userExist > 0) {
      return res.send("User already exists");
    }
    await new Promise((resolve, reject) => {
      pool.query('INSERT INTO users1 (firstname,lastname,email,password) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, password], (error, result) => {
        if (error) {
          throw error
        }
        resolve()
      })
    })
    return res.send("User registered successfully")
  } catch (error) {
    return res.send("error")
  }

});

// login api
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await new Promise((resolve, reject) => {
      pool.query('SELECT * from users1 where (email,password) = ($1, $2)', [email, password], (error, result) => {
        if (error) {

          throw error;
        }
        resolve(result.rows)
      })
    })
    if (user.length == 0) {
      return res.send("User not found")
    }
    if (user[0].email !== email || user[0].password !== password) {
      return res.send("Invalid username or password.")
    }
    let accessToken = generateAccessToken({
      userId: user[0].id,
      firstName: user[0].firstname,
      email: user[0].email
    })
    return res.send({ accessToken });

  } catch (error) {
    console.log(error)
    return res.send("error")
  }

});


app.listen(PORT, () => {
  console.log("your server start")
})
