const express = require("express");
const { login , register , logout } = require("../controllers/authcontroller");

const router = express.Router();

router.post("/login" , login);
router.post("/register" , register );
router.get("/logout" , logout);

module.exports = router;