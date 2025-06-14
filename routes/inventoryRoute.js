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
router.get("/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)
// Build detail view by vehicle id
router.get('/detail/:id',
  utilities.handleErrors(invController.buildByVehicleId)
)
// Build the management view
router.get('',
  utilities.authenticateAccount,
  utilities.handleErrors(invController.buildManagement)
)
// Build the getInventory view
router.get('/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
)
// Build the addClassification view
router.get('/add-classification',
  utilities.authenticateAccount,
  utilities.handleErrors(invController.buildAddClassification)
)
// Build the addInventory view
router.get('/add-inventory',
  utilities.authenticateAccount,
  utilities.handleErrors(invController.buildAddInventory)
)
// Build edit view by vehicle id
router.get('/edit/:id',
  utilities.authenticateAccount,
  utilities.handleErrors(invController.buildEditInventory)
)
// Build delete view by vehicle id
router.get('/delete/:id',
  utilities.authenticateAccount,
  utilities.handleErrors(invController.buildDeleteConfirmation)
)

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
// Send the inventory update to the server
router.post(
  "/update/",
  regValidate.addInventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)
// Send the inventory delete to the server
router.post(
  "/remove/",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;