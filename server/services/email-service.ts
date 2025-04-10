import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "../templates/email.templates.js";

// Function for sending email verification
export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "SPEAK — Verifikasi akun kamu dengan satu klik!",
    html: getVerificationEmailTemplate(verificationLink),
    // headers: {
    //   "X-Mailer": "Nodemailer via SPEAK App",
    //   "X-Priority": "3",
    //   ...(process.env.EMAIL_USER && { "Return-Path": process.env.EMAIL_USER }),
    // }
  };

  return transporter.sendMail(mailOptions);
}