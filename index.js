const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
// console.log(process.env)
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf")

let app = express();
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    store: new FileStore(),
    secret: process.env.SECRET_KEY,
    resave: false, //overwrites previous so set to false if unwanted
    saveUninitialized: true, //create new session if it does not exist
  })
);

app.use(flash());
app.use(csrf());

app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next()
})

const landingRoutes = require("./routes/landing");
const posterRoutes = require("./routes/poster");
const userRoutes = require("./routes/users")

async function main() {
  app.use("/", landingRoutes);
  app.use("/posters", posterRoutes);
  app.use("/user", userRoutes)
}

main();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started at", process.env.PORT);
});
