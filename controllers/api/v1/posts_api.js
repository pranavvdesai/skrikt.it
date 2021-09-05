const Post = require("../../../models/post.js");
const Comment = require("../../../models/comments.js");

module.exports.index = async (req, res) => {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")

    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  return res.json(200, {
    message: "lists of posts",
    posts: posts,
  });
};

module.exports.destroy = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == req.user.id) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
        message: "posts and commants demleted",
      });
    } else {
      return res.json(401, {
        message: "you are not authorized to delete this post",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server eror",
    });
  }
};
