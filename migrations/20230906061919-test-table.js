'use strict';

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

exports.up = function (db) {
  const dbName = process.env.DB_DATABASE; // Get the database name from your environment variables
  const connection = Object.assign({}, db.connection, { database: dbName });
  return db.createTable("test_table", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    name: {
      type: "string",
      length: 255,
      notNull: true
    }
  }, { connection })
}

exports.down = function (db) {
  const dbName = process.env.DB_DATABASE; // Get the database name from your environment variables
  const connection = Object.assign({}, db.connection, { database: dbName });
  return db.dropTable("test_table", {connection});
};

exports._meta = {
  "version": 1
};
