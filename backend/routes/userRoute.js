const express = require("express")
const router = express.Router();
const protect = require("../middleware/auth");


const { signup,login,profile,addAddress } = require("../controllers/userController");
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile',protect, profile);
router.post('/add-address',protect, addAddress);

module.exports = router;