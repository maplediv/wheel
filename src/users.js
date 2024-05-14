
const express = require("express");
const router = express.Router();
const db = require("../db");

/** Get users: [user, user, user] */

router.get("/", async (req, res, next) {
    const results = db.query(
          `SELECT * FROM users`);
  
    return res.json(results.rows);
  });

  module.exports= router;