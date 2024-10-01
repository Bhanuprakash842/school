// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' }, // role-based access
  isVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiration: Date,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
