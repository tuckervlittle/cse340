const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invCont = {}

/* ***************************
 *  Build inventory view by classification
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail view by vehicle_id
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.id
  const data = await invModel.getVehicleById(vehicle_id)
  const nav = await utilities.getNav()
  const detailView = await utilities.buildDetailView(data)
  res.render("./inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    detailView
  })
}

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
  })
}

/* ***************************
 *  Deliver add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const { classification_id } = req.body
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(classification_id)
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
*  Process Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  
  const result = await invModel.addClassification(classification_name)
  
  let nav = await utilities.getNav()
  if (result) {
    req.flash(
      "notice",
      `Classification "${classification_name}" Created.`
    )
    res.status(201).render("inventory/management", {
      title: "Manage Inventory",
      nav,
      errors: null,
    })
  } else { 
    req.flash("error", "Sorry, creating the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  
  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  
  let classificationList = await utilities.buildClassificationList(classification_id)

  if (result) {
    req.flash(
      "notice",
      `${inv_make} ${inv_model} added to inventory!`
    )
    res.status(201).render("inventory/management", {
      title: "Manage Inventory",
      nav,
      errors: null,
    })
  } else { 
    req.flash("error", "Sorry, adding the inventory failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationList,
    })
  }
}

module.exports = invCont