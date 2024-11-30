import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD, 
  },
});

const sendEmail = (to, subject, text) => {
  if (!to) {
    console.error("No recipients defined");
    return;
  }
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    html:text ,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendEmail;