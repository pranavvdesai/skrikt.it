const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log("err in finding profile");
      return;
    }
    return res.render("profile", { profile_user: user });
  });
};

module.exports.update = async (req, res) => {
  if (req.user.id == req.params.id) {
    try {
      var user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, (err) => {
        if (err) {
          console.log("Multer error", err);
        }
        user.name = req.body.profile_name;
        user.email = req.body.profile_email;
        console.log(req.file)
        if(req.file){
          if(user.avatar && fs.existsSync(path.join(__dirname, "..", user.avatar))){
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarpath + '/' + req.file.filename;
        }
        user.save()
        return res.redirect('back')
      });
      req.flash("success", "Profile updated.");
    } catch (err) {
      req.flash("error", "Error updating profile.");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "You can only edit your own profile.");
    return res.status(401).send("unauthorised");
  }
};
