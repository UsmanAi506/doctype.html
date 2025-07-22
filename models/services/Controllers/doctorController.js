// controllers/doctorController.js
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const verifyDoctor = async (req, res) => {
  try {
    const { doctorId, status, adminComments } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can verify doctors' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update doctor status
    doctor.status = status;
    if (adminComments) doctor.adminComments = adminComments;
    await doctor.save();

    // If approved, update user role
    if (status === 'approved') {
      await User.findByIdAndUpdate(doctor.userId, { role: 'doctor' });
    }

    res.status(200).json({ 
      message: `Doctor ${status} successfully`,
      doctor 
    });
  } catch (error) {
    console.error('Error verifying doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyDoctor };
