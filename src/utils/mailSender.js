import nodemailer from "nodemailer";
import { readFile as readFileAsync } from 'fs/promises';
import Handlebars from 'handlebars';
// Function to send an OTP verification email
const sendVerificationEmail = async (email, otp) => {
  try {
    const htmlTemplate = await readFileAsync('public/temp/email.handlebars', 'utf-8');
    const template = Handlebars.compile(htmlTemplate);
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Gmail address from environment variables
        pass: process.env.GMAIL_PASSWORD, // Gmail password from environment variables
      },
    });
    const htmltosend = template({
        otp: otp, // OTP to be inserted into the email template
      });
  

    // Define the email content
    const message = {
      from: process.env.GMAIL_USER, // Sender email
      to: email, // Recipient email
      subject: "OTP Verification", // Email subject
      html: htmltosend
    };

    // Send the email
    const mailResponse = await transporter.sendMail(message);
    console.log("Email sent successfully: ", mailResponse.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // Ensure errors bubble up to be handled properly
  }
};

export {sendVerificationEmail};