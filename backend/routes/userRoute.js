const express = require("express")
const router = express.Router();
const protect = require("../middleware/auth");


const { signup,login,profile,addAddress, getAddresses } = require("../controllers/userController");
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile',protect, profile);
router.post('/add-address',protect, addAddress);
router.get('/addresses',protect, getAddresses);

module.exports = router;