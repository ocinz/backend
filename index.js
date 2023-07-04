import express from "express";
import session from "express-session";
import { dummies } from "./dummies.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { errors: [] });
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs", { errors: [] });
});

app.post(
  "/login",
  (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = [];

    if (email === "") {
      errors.push("Email cannot empty");
    }
    if (password === "") {
      errors.push("Password cannot empty");
    }
    if (errors.length > 0) {
      res.render("login.ejs", { errors: errors });
    }
    next();
  },
  (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = [];

    const emailState = dummies.map((dummy) => dummy.email === email);
    const passwordState = dummies.map((dummy) => dummy.password === password);
    if (!emailState) {
      errors.push("Your email is wrong");
    }
    if (!passwordState) {
      errors.push("Your password is wrong");
    }
    if (errors.length > 0) {
      res.render("login.ejs", { errors: errors });
    }
    res.redirect("/");
  }
);

app.post(
  "/signup",
  (req, res, next) => {
    console.log("Pemeriksaan nilai input kosong");
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const errors = [];

    if (username === "") {
      errors.push("Nama Pengguna kosong");
    }

    if (email === "") {
      errors.push("Email kosong");
    }

    if (password === "") {
      errors.push("Kata Sandi kosong");
    }

    if (errors.length > 0) {
      res.render("signup.ejs", { errors: errors });
    } else {
      next();
    }
  },
  (req, res, next) => {
    console.log("Pemeriksaan email duplikat");
    const email = req.body.email;
    const errors = [];
    connection.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
      if (results.length > 0) {
        errors.push("Failed to register user");
        res.render("signup.ejs", { errors: errors });
      } else {
        next();
      }
    });
  },
  (req, res) => {
    console.log("Pendaftaran");
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (error, hash) => {
      connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash], (error, results) => {
        req.session.userId = results.insertId;
        req.session.username = username;
        res.redirect("/list");
      });
    });
  }
);

app.listen(5000, () => {
  console.log(`Server running and up at http://localhost:5000/`);
});
