const mysql = require("mysql")
const { db } = require("./config")
const conn = mysql.createPool(db)

module.exports = conn;