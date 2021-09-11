const nodeMailer = require("../config/nodemailer");

exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );
  console.log("inside new comment mailer");
  nodeMailer.transporter.sendMail(
    {
      from: "theimmortallucifer@gmail.com",
      to: comment.user.email,
      subject: "New Comment published",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err);
        return;
      } else {
      }
    }
  );
};
