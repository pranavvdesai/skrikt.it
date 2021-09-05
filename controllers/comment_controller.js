const Comment = require("../models/comments");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments-mailer");
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");

module.exports.createComment = async (req, res) => {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });

      post.comments.push(comment);
      post.save();
      comment = await comment.populate('user', 'name email').execPopulate();
      let job = queue.create('emails-queue', comment).save(function(err) {
        if (err) {
          console.log("err in creating queue");
          return;
          }
          console.log(job.id)
          
        });

      if (req.xhr) {

        res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment successfully created",
        });
      }

      req.flash("success", "Comment successfully added");

      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Error while adding comment");
    return;
  }
};

module.exports.deletecomment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).populate("post");
    console.log(comment.post.user + "-" + req.user._id);
    if (comment.user == req.user.id || comment.post.user == req.user.id) {
      let postId = comment.post;
      comment.remove();
      req.flash("success", "Comment successfully deleted");
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      if (req.xhr) {
        res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment Deleted",
        });
      }

      return res.redirect("back");
    } else {
      req.flash("error", "You don't have permission to delete this comment");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Error while deleting comment");
    return;
  }
};
