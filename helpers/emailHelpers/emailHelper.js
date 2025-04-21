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

const sendEmail = async (to, subject, text) => {
  if (!to) {
    console.log("No recipients defined");
    return;
  }

  console.log("Sending email to:", to);
  console.log("Email subject:", subject);
  console.log("Email text:", text);
  console.log("Emprocess.env.ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("Emprocess.env.ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    html: text,
  };

  console.log("Mail options:", mailOptions);

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error sending email:", err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default sendEmail;