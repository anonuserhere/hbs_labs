const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

// const csurf = require("csurf")

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    store: new FileStore(),
    secret: "secret_password",
    resave: false, //overwrites previous so set to false if unwanted
    saveUninitialized: true, //create new session if it does not exist
  })
);

app.use(flash());
// app.use(csurf());

// app.use(function (req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

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
