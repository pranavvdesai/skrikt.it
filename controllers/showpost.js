var Post = require("../models/post");
const User = require("../models/user");

module.exports.showPost = async (req, res) => {
try{
  let posts = await Post.find({})
     .sort('-createdAt')
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    
    let user= await User.find({})
    return res.render("home", { posts: posts, user_all: user });

}
catch(err){
  console.log(err);
  return
}
  
};

