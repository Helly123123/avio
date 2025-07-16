const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendVerificationCode = async (email, code) => {
  if (!email || !code) {
    console.error("Email and code are required");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Awio" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #f7fafc;
                  margin: 0;
                  padding: 0;
                  color: #4a5568;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                  overflow: hidden;
              }
              .header {
                  background-color: #4299e1;
                  padding: 20px;
                  text-align: center;
              }
              .header h1 {
                  color: white;
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 30px;
              }
              .code-container {
                  background-color: #ebf8ff;
                  border-radius: 6px;
                  padding: 15px;
                  text-align: center;
                  margin: 25px 0;
              }
              .verification-code {
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 3px;
                  color: #2b6cb0;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #718096;
                  border-top: 1px solid #e2e8f0;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #4299e1;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  margin-top: 15px;
              }
              .note {
                  font-size: 14px;
                  color: #718096;
                  margin-top: 25px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Verification Code</h1>
              </div>
              <div class="content">
                  <p>Hello,</p>
                  <p>Please use the following verification code to complete your action:</p>
                  
                  <div class="code-container">
                      <div class="verification-code">${code}</div>
                  </div>
                  
                  <p>This code will expire in <strong>15 minutes</strong>.</p>
                  
                  <p class="note">If you didn't request this code, please ignore this email or contact support if you have any concerns.</p>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} Awio. All rights reserved.</p>
                  <p>Need help? <a href="mailto:support@yourapp.com">Contact our support team</a></p>
              </div>
          </div>
      </body>
      </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendVerificationCode };
