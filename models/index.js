const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
  tableName: "posters",
});

const Category = bookshelf.model("Category", {
  tableName: "categories",
});

const User = bookshelf.model("User", {
  tableName : "users"
})

module.exports = { Poster, Category, User };
