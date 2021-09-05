var User = require("../models/user");

module.exports.register = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("register.ejs", { title: "register" });
};

module.exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("login.ejs", { title: "login" });
};

module.exports.create = (req, res) => {
  console.log(req.body);
  if (req.body.password != req.body.confirmpassword) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("error in finding user");
      return;
    }
    if (!user) {
      User.create(req.body, (err, user) => {
        if (err) {
          console.log("err in creating");
          return;
        }

        return res.redirect("/login");
      });
    } else {
      return res.redirect("back");
    }
  });
};

module.exports.loginvalidation = (req, res) => {
  req.flash("success", "You have successfully logged in");
  return res.redirect("/");
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You have successfully logged out");

  return res.redirect("/");
};
