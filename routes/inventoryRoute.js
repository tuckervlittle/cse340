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
// Build the addInventory view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))

/* ***************
 *  Post Routes
 * ************** */
// Send the classification data to the server
router.post(
  "/add-classification",
  regValidate.addClassificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
// Send the inventory data to the server
router.post(
  "/add-inventory",
  regValidate.addInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;