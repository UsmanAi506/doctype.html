// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const { sendAppointmentConfirmation } = require('../services/emailService');
const { processBankTransfer } = require('../services/paymentService');

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time, serviceType, paymentMethod, accountDetails } = req.body;
    
    // Validate input
    if (!doctorId || !patientId || !date || !time || !serviceType || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check doctor availability (simplified - actual implementation would be more robust)
    const existingAppointment = await Appointment.findOne({ doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    // Process payment
    const doctor = await Doctor.findById(doctorId);
    const paymentData = {
      amount: doctor.consultationFee,
      currency: 'PKR',
      accountDetails,
      reference: `APPT-${Date.now()}`
    };
    
    const paymentResult = await processBankTransfer(paymentData);
    
    // Create appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      serviceType,
      status: 'confirmed',
      payment: {
        method: paymentMethod,
        amount: paymentData.amount,
        currency: paymentData.currency,
        transactionId: paymentResult.transactionId,
        status: paymentResult.status
      }
    });
    
    await appointment.save();
    
    // Send confirmation email
    const patient = await User.findById(patientId);
    await sendAppointmentConfirmation(patient.email, {
      patientName: patient.name,
      doctorName: doctor.userId.name,
      date,
      time,
      service: serviceType,
      amount: paymentData.amount,
      currency: paymentData.currency
    });
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
      payment: paymentResult
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

module.exports = { bookAppointment };
