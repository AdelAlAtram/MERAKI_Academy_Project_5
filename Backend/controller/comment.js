const { pool } = require("../models/db");

const addcomment = (req, res) => {
  const { content } = req.body;

  const user_id = req.token.userId;
  const post_id = req.params.id;

  const query = `INSERT INTO comments (content,user_id,post_id) VALUES ($1,$2,$3) RETURNING *;`;
  const data = [content,user_id,post_id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "comment created successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const getAllComments = (req, res) => {
  const query = `SELECT * FROM comments;`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the comments",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const updateCommentsById = (req, res) => {
  const comment_id = req.params.id;
  const { content } = req.body;

  const query = `UPDATE comments
   SET
     content = COALESCE($1, content)
     WHERE comment_id = $2 RETURNING *;`;
  const data = [ content || null, comment_id];
  console.log(data);
  pool
    .query(query, data)
    .then((result) => {
        res.status(200).json({
          success: true,
          message: `comment with id: ${comment_id} updated successfully `,
          result: result.rows[0],
        });
    
      
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error happened while updating comment",
        err: err.message,
      });
    });
};

const deleteCommentById = (req, res) => {
  const comment_id = req.params.id;
  const query = `DELETE FROM comments WHERE comment_id=$1;`;
  const data = [comment_id];
  pool
    .query(query, data)
    .then((result) => {
        res.status(200).json({
          success: true,
          message: `posts with id:${comment_id} deleted successfully`,
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error happened while deleting post",
        err: err.message,
      });
    });
};

module.exports = {
    addcomment,
    getAllComments,
    updateCommentsById,
    deleteCommentById
};