"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

// exports.up = function (db) {
//   return db.addForeignKey(
//     "posters",
//     "categories",
//     "poster_category_fk",
//     {
//       category_id: "id",
//     },
//     { onDelete: "CASCADE", onUpdate: "RESTRICT" }
//   );
// };

// exports.down = function (db) {
//   return db.removeForeignKey("posters", "poster_category_fk");
// };

exports.up = function (db) {
  return null;
}

exports.down = function (db) {
  return null
}

exports._meta = {
  version: 1,
};
