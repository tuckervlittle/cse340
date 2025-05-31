const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
  return [
    // classification_name is required and must not already exist
    body("classification_name")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z]+$/)
      .withMessage('Only letters are allowed (no spaces or special characters)')
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        console.log(classificationExists)
        if (classificationExists) {
          throw new Error("Classification already exists. Please verify your classification");
        }
      }),
    ]
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.addInventoryRules = () => {
  return [
    // A classification must be selected
    body("classification_id")
      .notEmpty()
      .withMessage('Classification is required'),
    // Make must be letters and spaces with a length > 2
    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z ]+$/)
      .withMessage('Make: Only letters and spaces are allowed (no special characters)'),
    // Model must be letters and spaces with a length > 2
    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z\d ]+$/)
      .withMessage('(Required) Model: Only letters and spaces are allowed (no special characters)'),
    // Year must be numbers with a length = 4
    body("inv_year")
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .matches(/^\d{4}$/)
      .withMessage('(Required) Year: Only 4 digit year'),
    // Description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage('(Required) Description'),
    // Must be a path
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^([a-zA-Z0-9_\-/\\:.]+)$/)
      .withMessage('(Required) Image: Invalid path format'),
    // Must be a path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^([a-zA-Z0-9_\-/\\:.]+)$/)
      .withMessage('(Required) Thumbnail: Invalid path format'),
    // Must be a number, no special characters
    body("inv_price")
      .trim()
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage('(Required) Price: Only numbers are allowed'),
    // Must be a number, no special characters
    body("inv_miles")
      .trim()
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage('(Required) Mileage: Only numbers are allowed'),
    // Color must be letters and spaces
    body("inv_color")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z ]+$/)
      .withMessage('(Required) Color: Only letters and spaces are allowed (no special characters)')
    ]
}
 
/* ******************************
 * Check Classification data and
 * return errors or continue to management
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check Inventory data and
 * return errors or continue to management
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)

  let classificationList = await utilities.buildClassificationList(classification_id)
  console.log(inv_description)
  console.log("rolls")
  console.log(errors)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate