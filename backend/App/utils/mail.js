import nodemailer from "nodemailer";

const sendMail = async (email, subject, template) => {
  console.log("sendMail function called");
  console.log("Sender configured:", !!process.env.SENDER_EMAIL);
  console.log("Password configured:", !!process.env.SENDER_PASSWORD);

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

    console.log("Attempting to send email to:", email);

    const info = await config.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html: template,
    });

    console.log("Email accepted:", info.accepted);
    console.log("Email rejected:", info.rejected);
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    console.error("Error code:", error.code);
    return false;
  }
};

export default sendMail;