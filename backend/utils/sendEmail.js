import nodemailer from "nodemailer";

// Send OTP email (keep as is)
export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to PROJECT-HD!",
    text: `Hi ${name},\n\nWelcome to our family! We're thrilled to have you onboard. Enjoy your journey with us.\n\n- PROJECT-HD Team`,
  };

  await transporter.sendMail(mailOptions);
};
