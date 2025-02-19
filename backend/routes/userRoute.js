const express = require("express")
const router = express.Router();
const protect = require("../middleware/auth");


const { signup,login,profile } = require("../controllers/userController");
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile',protect, profile);
module.exports = router;