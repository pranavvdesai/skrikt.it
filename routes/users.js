const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");
const postController = require("../controllers/post_controller");
const commentController = require("../controllers/comment_controller");
const profileController = require("../controllers/profile_controller");

router.post(
  "/postcreate",
  passport.checkAuthentication,
  postController.createPost
);
router.post(
  "/commentcreate",
  passport.checkAuthentication,
  commentController.createComment
);
router.get("/delete/:id", passport.checkAuthentication, postController.destroy);
router.get(
  "/deletecomment/:id",
  passport.checkAuthentication,
  commentController.deletecomment
);
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  profileController.profile
);
router.post(
  "/updateprofile/:id",
  passport.checkAuthentication,
  profileController.update
);

router.get("/profile", passport.checkAuthentication, usersController.profile);

module.exports = router;
