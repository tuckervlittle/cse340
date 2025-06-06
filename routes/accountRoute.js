// Needed Resources
const express = require("express")
const router = new express.Router();
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* ***************
 *  Get Routes
 * ************** */
// Deliver the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration))
router.get("/",utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

/* ***************
 *  Post Routes
 * ************** */
// Send the registration data to the server
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;