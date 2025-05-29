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
  console.log(vehicle_id)
  const data = await invModel.getVehicleById(vehicle_id)
  const nav = await utilities.getNav()
  const detailView = await utilities.buildDetailView(data)
  res.render("./inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    detailView
  })
}

module.exports = invCont