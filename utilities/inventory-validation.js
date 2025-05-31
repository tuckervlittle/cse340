const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
  return [
    // password is required and must be strong password
    body("classification_name")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z]+$/)
      .withMessage('Only letters are allowed (no spaces or special characters)')
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        console.log("tootsie")
        console.log(classificationExists)
        if (classificationExists) {
          throw new Error("Classification already exists. Please verify your classification");
        }
      }),
    ]
}
 
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  console.log("roll")
  console.log(errors)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Registration",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate