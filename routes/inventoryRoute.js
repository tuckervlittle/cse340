// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")

/* ***************
 *  Get Routes
 * ************** */
// Build inventory view by classification id
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// Build detail view by vehicle id
router.get('/detail/:id', utilities.handleErrors(invController.buildByVehicleId))
// Build the management view
router.get('', utilities.handleErrors(invController.buildManagement))
// Build the addClassification view
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))

/* ***************
 *  Post Routes
 * ************** */
// Send the registration data to the server
router.post(
  "/management",
  regValidate.addClassificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

module.exports = router;