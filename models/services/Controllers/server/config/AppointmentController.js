const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { sendAppointmentConfirmation } = require('../services/emailService');
const { processBankTransfer } = require('../services/paymentService');

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, serviceType, paymentMethod, accountDetails } = req.body;
    const patientId = req.user.id;
    
    // Validate input
    if (!doctorId || !date || !time || !serviceType || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check doctor availability
    const existingAppointment = await Appointment.findOne({ doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    // Get doctor details
    const doctor = await Doctor.findById(doctorId).populate('userId');
    if (!doctor || doctor.status !== 'approved') {
      return res.status(404).json({ message: 'Doctor not available' });
    }

    // Determine price based on service type
    let price = doctor.consultationFee;
    let currency = 'PKR';
    
    if (serviceType === 'international') {
      price = doctor.consultationFee * 3; // 3x for international
      currency = 'USD';
    } else if (serviceType === 'second-opinion') {
      price = 10000; // Fixed price for second opinion
    }

    // Process payment
    const paymentData = {
      amount: price,
      currency,
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
