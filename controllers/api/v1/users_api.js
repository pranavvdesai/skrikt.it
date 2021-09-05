const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

const env = require("../../../config/environment");

module.exports.loginvalidation = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      res.status(422).json({ message: "Invalid credentials" });
    }
    return res.json(200, {
      message: "sign in suxas, here is ur token, keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "1000000",
        }),
      },
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
