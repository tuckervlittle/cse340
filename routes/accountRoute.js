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
router.get("/login",
  utilities.handleErrors(accountController.buildLogin)
)
// Deliver the Register view
router.get("/register",
  utilities.handleErrors(accountController.buildRegistration)
)
// Deliver the Account Management view
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)
// Deliver the Account Edit view
router.get("/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount)
)
// Logout and deliver the Home view
router.get("/logout",
  utilities.handleErrors(accountController.logout)
)

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
// Send the account update to the server
router.post(
  "/update",
  regValidate.accountRules(),
  regValidate.checkRegDataUpdate,
  utilities.handleErrors(accountController.updateAccount)
)
// Send the password update to the server
router.post(
  "/password",
  regValidate.updatePasswordRules(),
  regValidate.checkRegDataUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;