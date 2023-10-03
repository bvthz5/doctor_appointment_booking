const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendResetPasswordEmail(email, token) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Reset password",
    html: `<p>Click <a href="http://localhost:${process.env.PORT_UI}/reset-password?token=${token}">here</a> to reset your password</p>`,
  };

  sendMail(mailOptions);
}

function sendGeneratedPassword(email, password) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Login Credentials",
    html: `<p>Email: ${email}</p> <br/><p>Password: ${password} </p> `,
  };

  sendMail(mailOptions);
}

function sendOTPVerificationEmail(email, token) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "OTP Verification",
    html: `<p>OTP: ${token}</p>`,
  };

  sendMail(mailOptions);
}

function sendBookingAcceptedEmail(
  email,
  userName,
  bookingDate,
  bookingTime,
  doctorName,
  hospitalName
) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Booking Accepted",
    html: getBookingAcceptedEmailTemplate(
      userName,
      bookingDate,
      bookingTime,
      doctorName,
      hospitalName
    ),
  };

  sendMail(mailOptions);
}

function sendBookingRejectedEmail(email, userName, doctorName) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Booking Rejected",
    html: getBookingRejectedEmailTemplate(userName, doctorName),
  };

  sendMail(mailOptions);
}

function sendCancelledBookingEmail(email, userName, bookingId, doctorName) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Booking Cancelled",
    html: getCancelledBookingEmailTemplate(userName, bookingId, doctorName),
  };

  sendMail(mailOptions);
}

function sendBookingTimeChangedEmail(
  email,
  userName,
  bookingDate,
  bookingTime,
  doctorName,
  hospitalName
) {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Booking Time Changed",
    html: sendBookingTimeChangedEmailTemplate(
      userName,
      bookingDate,
      bookingTime,
      doctorName,
      hospitalName
    ),
  };
  console.log(email);
  sendMail(mailOptions);
}

function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function getBookingAcceptedEmailTemplate(
  userName,
  bookingDate,
  bookingTime,
  doctorName,
  hospitalName
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Booking Acceptance Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      p {
        margin: 0 0 16px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .logo {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto;
      }
      .signature {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      	
      &#127973; <br>
  
      <p>Dear ${userName},</p>
  
      <p>We are pleased to inform you that your booking has been accepted by the doctor.</p>
  
      <p><strong>Booking Details:</strong></p>
      <p>Date: ${bookingDate}</p>
      <p>Time: ${bookingTime}</p>
      <p>Doctor Name: ${doctorName}</p>
      <p>Hospital Name: ${hospitalName}</p>
  
      <p>Thank you for choosing our services. We look forward to providing you with the best possible care.</p>
  
      <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
  
      <p>Best regards,<br>Your Hospital Team</p>
    </div>
  </body>
  </html>
  
  `;
}

function getBookingRejectedEmailTemplate(userName, doctorName) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <title>Booking Rejection Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    p {
      margin-bottom: 16px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .logo {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
    .signature {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="email-container">
  &#127973;<br>

    <p>Dear ${userName},</p>

    <p>We regret to inform you that your booking has been rejected by Dr. ${doctorName}.</p>

    <p>Please feel free to reach out to us for any further assistance.</p>

    <p>Best regards,<br>
    Your Hospital Team</p>
  </div>
</body>
</html>
`;
}

function getCancelledBookingEmailTemplate(userName, bookingId, doctorName) {
  return ` 
  <!DOCTYPE html>
  <html>
  
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
          }
  
          .header {
              background-color: #f8f8f8;
              padding: 20px 0;
              text-align: center;
          }
  
          .content {
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #e4e4e4;
          }
  
          .footer {
              background-color: #f8f8f8;
              padding: 10px 0;
              text-align: center;
          }
  
          .logo {
              display: block;
              max-width: 100%;
              height: auto;
              margin: 0 auto;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="header">
            
              <h1>Booking Cancellation Notification</h1>
          </div>
          <div class="content">
          &#127973;<br>
              <p>Dear ${userName},</p>
              <p>We regret to inform you that your booking with ID <strong>${bookingId}</strong> has been canceled by Dr. ${doctorName}.</p>
              <p>We understand the inconvenience this may cause and apologize for any disruption to your plans.</p>
              <p>If you have any questions or require further assistance, please don't hesitate to contact our dedicated support team. We're here to help.</p>
          </div>
          <div class="footer">
              <p>Best regards,<br>Your Hospital Team</p>
          </div>
      </div>
  </body>
  
  </html>
  `;
}

function sendBookingTimeChangedEmailTemplate(
  userName,
  bookingDate,
  bookingTime,
  doctorName,
  hospitalName
) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Booking Time Has Changed</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background-color: #f7f7f7;
    }
    .header {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .details {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .info {
      font-weight: bold;
    }
    .footer {
      font-size: 14px;
      color: #555;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Important Update: Your Booking Time Has Changed</div>
    <p>Dear ${userName},</p>
    <p>We hope this message finds you well. We would like to inform you about an important update regarding your booking with ${doctorName} at ${hospitalName}.</p>
    <p>Due to unforeseen circumstances, there has been a change in the appointment schedule, and we need to reschedule your booking to a new time. We apologize for any inconvenience this may cause.</p>
    <div class="details">
      <p>Your new appointment details are as follows:</p>
      <p class="info">Date: ${bookingDate}</p>
      <p class="info">New Time: ${bookingTime}</p>
      <p class="info">Doctor: ${doctorName}</p>
      <p class="info">Hospital: ${hospitalName}</p>
    </div>
    <p>Thank you for choosing Our Hospital for your healthcare needs. We look forward to seeing you at your updated appointment time.</p>
    <div class="footer">Best regards,<br>The Hospital Team</div>
  </div>
</body>
</html>


  `;
}
module.exports = {
  sendResetPasswordEmail,
  sendOTPVerificationEmail,
  sendBookingAcceptedEmail,
  sendBookingRejectedEmail,
  sendCancelledBookingEmail,
  sendBookingTimeChangedEmail,
  sendGeneratedPassword,
};
