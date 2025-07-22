// Database models for all modules

// Pharmacy Order Model
const pharmacyOrderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prescription: { type: String, required: true }, // URL to prescription image
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  deliveryAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  payment: {
    method: { type: String },
    amount: { type: Number },
    status: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Lab Test Model
const labTestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tests: [{ type: String, required: true }],
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
  collectionType: { type: String, enum: ['home', 'lab'], required: true },
  address: { type: String },
  appointmentDate: { type: Date },
  results: { type: String }, // URL to test results
  status: { type: String, enum: ['pending', 'sample_collected', 'processing', 'completed'], default: 'pending' },
  payment: {
    method: { type: String },
    amount: { type: Number },
    status: { type: String }
  }
});

// Medical Tourism Package Model
const medicalTourismSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  treatments: [{ type: String }],
  duration: { type: Number }, // in days
  price: { type: Number },
  currency: { type: String, default: 'USD' },
  inclusions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Corporate Wellness Plan Model
const corporatePlanSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  planName: { type: String, required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  benefits: {
    consultations: { type: Number },
    labTests: { type: Number },
    therapySessions: { type: Number }
  },
  duration: { type: Number }, // in months
  price: { type: Number },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  startDate: { type: Date },
  endDate: { type: Date }
});
