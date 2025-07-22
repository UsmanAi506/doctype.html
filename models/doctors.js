const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { 
    type: String, 
    required: true,
    enum: ['GP', 'Psychologist', 'Cardiologist', 'Pediatrician', 'Dentist', 
           'Oncologist', 'Dermatologist', 'Orthopedic', 'Other']
  },
  qualifications: { type: String, required: true },
  pmdcNumber: { type: String, required: true },
  experience: { type: Number, required: true },
  consultationFee: { type: Number, required: true },
  availableDays: [{ type: String }],
  availableTimes: [{ type: String }],
  timezone: { type: String },
  languages: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: [{
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Doctor', doctorSchema);
