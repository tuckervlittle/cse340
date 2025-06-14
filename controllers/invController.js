const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const commentModel = require("../models/comment-model")

const invCont = {}

/* ***************************
 *  Build inventory view by classification
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      loggedIn: res.locals.loggedIn || false
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build detail view by vehicle_id
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicle_id = req.params.id
    const data = await invModel.getVehicleById(vehicle_id)
    const comments = await commentModel.getCommentsByVehicleId(vehicle_id)
    data.comments = comments
    const nav = await utilities.getNav()
    const detailView = await utilities.buildDetailView(data)
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      detailView,
      loggedIn: res.locals.loggedIn || false
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const notice = req.flash("notice")
    res.render("./inventory/management", {
      title: "Manage Inventory",
      nav,
      notice,
      classificationSelect,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Classification Data
* *************************************** */
invCont.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body
    
    const result = await invModel.addClassification(classification_name)
    
    let nav = await utilities.getNav()
    if (result) {
      req.flash(
        "notice",
        `Classification "${classification_name}" Created.`
      )
      return res.redirect(301, "/inv")
      // res.status(201).render("inventory/management", {
      //   title: "Manage Inventory",
      //   nav,
      //   errors: null,
      // })
    } else { 
      req.flash("error", "Sorry, creating the classification failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Inventory Data
* *************************************** */
invCont.addInventory = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body
    
    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )
    
    if (result) {
      req.flash("notice", `${inv_make} ${inv_model} added to inventory!`)
      res.redirect("/inv/")
    } else { 
      const classificationList = await utilities.buildClassificationList(classification_id)
      req.flash("error", "Sorry, adding the inventory failed.")
      res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver edit-inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    let classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Update Inventory Data
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body
    
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv")
    } else { 
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `Sorry the insert failed.`)
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
      }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver delete-confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Delete Inventory Data
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const { inv_id } = req.body
    
    const deleteResult = await invModel.deleteInventory(inv_id)
  
    if (deleteResult) {
      req.flash("notice", `The vehicle was successfully deleted.`)
      res.redirect("/inv")
    } else { 
      req.flash("error", "Sorry, the delete failed")
      res.redirect(`/inv/delete/${inv_id}`)
      }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont