
import emailjs from "@emailjs/nodejs";

const sendMail = async (email, subject,otp ) => {
  try {
    console.log("EmailJS sendMail called");
    console.log("Recipient:", email);

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        subject: subject,
        otp:otp,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("EmailJS status:", response.status);
    console.log("EmailJS response:", response.text);

    return true;
  } catch (error) {
    console.error("EmailJS sending failed:", error);

    return false;
  }
};

export default sendMail;
