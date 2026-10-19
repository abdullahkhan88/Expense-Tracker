
import nodemailer from "nodemailer";

const sendMail = async (email, subject, template) => {
  try {
    const config = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const options = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html: template,
    };

    const info = await config.sendMail(options);

    console.log("Email accepted:", info.accepted);
    console.log("Email rejected:", info.rejected);

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

export default sendMail;
