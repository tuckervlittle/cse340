const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      loggedIn: false,
    })
  } catch (error) {
    console.error("Error delivering login view " + error)
  }
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
accountCont.buildRegistration = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    loggedIn: false,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("error", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      loggedIn: false,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      loggedIn: false,
      account_email,
    })
  } else { 
    req.flash("error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      loggedIn: false,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      loggedIn: false,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000})
      }
      return res.redirect("/account/")
    } else {
      req.flash("message error", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "login",
        nav,
        errors: null,
        account_email,
        loggedIn: false,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver Account Management view
* *************************************** */
accountCont.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  // const notice = req.flash("notice");
  let inventoryManagementLink = null
  const accountUpdateLink = `
  <div class="account-management">
    <h2>Account Management</h2>
    <a href="/account/update/${res.locals.accountData.account_id}">Update Account Info</a>
  </div>
  `
  if (res.locals.accountData.account_type != 'Client') {
    inventoryManagementLink = `
    <div class="account-management">
      <h2>Inventory Management</h2>
      <a href="/inv/">Manage Inventory</a>
    </div>
    `
  } else {
    inventoryManagementLink = null
  }
  res.render("account/management", {
    title: `Welcome ${res.locals.accountData.account_firstname}`,
    nav,
    // notice,
    errors: null,
    accountUpdateLink,
    inventoryManagementLink,
  })
}

/* ****************************************
*  Deliver Edit Account view
* *************************************** */
accountCont.buildEditAccount = async function (req, res, next) {
  try {
      const account_id = parseInt(req.params.id)
      let nav = await utilities.getNav()
      const accountData = await accountModel.getAccountById(account_id)
      res.render("./account/update-account", {
        title: "Edit Your Account",
        nav,
        errors: null,
        account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    } catch (error) {
      next(error)
    }
}

/* ****************************************
 *  Process Update Account Info request
 * ************************************ */
accountCont.updateAccount = async function (req, res, next) {
  try {
    const {
      account_id,
      account_firstname,
      account_lastname,
      account_email
    } = req.body
    
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      req.flash("notice", `Your account was successfully updated.`)
      res.redirect("/account")
    } else { 
      req.flash("notice", `Sorry the update failed.`)
      res.redirect(`account/update/${account_id}`)
      }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process Password Update request
 * ************************************ */
accountCont.updatePassword = async function (req, res, next) {
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  if (updateResult.rowCount) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
 *  Logout request, delete cookies and send to home
 * ************************************ */
accountCont.logout = async function (req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been signed out.")
  res.redirect("/")
}

module.exports = accountCont