const commentModel = require("../models/comment-model")

const commentController = {}

commentController.postComment = async function (req, res, next) {
  try {
    const { inv_id, comment_text } = req.body
    const account_id = res.locals.accountData.account_id

    await commentModel.addComment(comment_text, inv_id, account_id)

    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = commentController