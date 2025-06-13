// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const commentController = require("../controllers/commentController")

/* ***************
 *  POST Routes
 * ************** */
// Add comment
router.post("/add",
  utilities.checkLogin,
  commentController.postComment)

module.exports = router