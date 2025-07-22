const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  serviceType: { 
    type: String, 
    required: true,
    enum: ['video', 'chat', 'follow-up', 'family', 'international', 'second-opinion']
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'confirmed' 
  },
  payment: {
    method: { type: String },
    amount: { type: Number },
    currency: { type: String, default: 'PKR' },
    transactionId: { type: String },
    status: { type: String }
  },
  meetingLink: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
