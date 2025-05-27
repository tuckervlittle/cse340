const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="navigation">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      // Wave had a warning about back-to-back links so moved the </a>
      //  to include the div and removed the second <a>
      grid += '<li class="card">'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '"title="view ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" />'
        grid += '<hr />'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += vehicle.inv_make + ' ' + vehicle.inv_model
      // grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="view '
      //   + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      //   + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</a>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Detail view HTML
* ************************************ */
Util.buildDetailView = async function (vehicle) {
  const view = `
  <div class="detail">
    <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
    <div class="detail-info">
      <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
      <p><b>Price: </b>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
      <p><b>Mileage: </b>${vehicle.inv_miles.toLocaleString()}</p>
      <p><b>Description: </b>${vehicle.inv_description}</p>
    </div>
  </div>`
  return view
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util