const pool = require("../database/");

const commentModel = {}

/* ***************************
 *  Get comment data by inv_id
 * ************************** */
commentModel.getCommentsByVehicleId = async function (id) {
  try {
    const data = await pool.query(
      `SELECT c.comment_text, c.comment_date, a.account_firstname, a.account_lastname FROM public.comment c JOIN public.account a ON c.account_id = a.account_id WHERE c.inv_id = $1 ORDER BY c.comment_date DESC`,
      [id]
    );
    return data.rows;
  } catch (error) {
    console.error("getCommentsByVehicleId error:", error);
  }
}

/* ***************************
 *  Add comment data to table
 * ************************** */
commentModel.addComment = async function (comment_text, inv_id, account_id) {
  const sql = `
    INSERT INTO comment (comment_text, inv_id, account_id)
    VALUES ($1, $2, $3)
  `;
  return pool.query(sql, [comment_text, inv_id, account_id]);
}

module.exports = commentModel;