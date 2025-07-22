// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'usmanmalik86.mm@outlook.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendAppointmentConfirmation = async (to, appointmentDetails) => {
  const mailOptions = {
    from: 'usmanmalik86.mm@outlook.com',
    to,
    subject: 'Your Appointment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2E7D32;">Appointment Confirmed</h2>
        <p>Dear ${appointmentDetails.patientName},</p>
        <p>Your appointment has been successfully booked with ${appointmentDetails.doctorName}.</p>
        
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${appointmentDetails.date}</li>
          <li><strong>Time:</strong> ${appointmentDetails.time}</li>
          <li><strong>Service:</strong> ${appointmentDetails.service}</li>
          <li><strong>Amount Paid:</strong> ${appointmentDetails.amount} ${appointmentDetails.currency}</li>
        </ul>
        
        <p>You will receive a reminder before your appointment. For video consultations, please log in 5 minutes before your scheduled time.</p>
        
        <p>Thank you for using GlobalHealth Connect!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>If you need to cancel or reschedule, please visit your dashboard or contact support.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendAppointmentConfirmation };
